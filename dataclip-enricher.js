;(function () {
  var imgIndexes = []
  var jsonIndexes = []

  $('.ReactTable').each(function () {
    var $ths = $(this).find('.rt-thead .rt-th')
    $ths.each(function (index) {
      var name = $(this).text().trim()
      var m = name.match(/^\[img(\:([0-9]+)(\:([0-9]+))?)?\]/i)

      if (m) {
        var config = { index: index }
        if (m[2]) config.width = m[2]
        if (m[4]) config.height = m[4]
        imgIndexes.push(config)
      } else if (name.startsWith('[JSON]')) {
        jsonIndexes.push(index)
      }
    })
  })

  function updateImageColumns() {
    $('.ReactTable').each(function () {
      var $trs = $(this).find('.rt-tbody .rt-tr')
      $trs.each(function () {
        var $tr = $(this)
        imgIndexes.forEach(function (imgIndexConfig) {
          var $td = $tr.find('.rt-td').eq(imgIndexConfig.index)
          if (!$td.find('img').length && $td.text().toLowerCase().trim() !== 'empty') {
            var imageUrl = $td.text().trim()
            var $a = $('<a></a>').attr('href', imageUrl).attr('target', '_blank')
            var $img = $('<img />').attr('src', imageUrl).appendTo($a)
            if (imgIndexConfig.width) $img.attr('width', imgIndexConfig.width)
            if (imgIndexConfig.height) $img.attr('height', imgIndexConfig.height)
            $td.html($a)
          }
        })
      })
    })
  }

  function updateJsonColumns() {
    $('.ReactTable').each(function () {
      var $trs = $(this).find('.rt-tbody .rt-tr')
      $trs.each(function () {
        var $tr = $(this)
        jsonIndexes.forEach(function (jsonIndex) {
          var $td = $tr.find('.rt-td').eq(jsonIndex)
          if (!$td.find('a[data-json-link]').length && $td.text().toLowerCase().trim() !== 'empty') {
            var content = $td.text().trim()
            var obj

            try {
              obj = JSON.parse(content)
            } catch (err) { }

            if (obj) {
              var json = JSON.stringify(obj, null, 2)
              var $a = $('<a href="#" data-json-link>View</a>').data('json-value', json)
              $td.html($a)
            }
          }
        })
      })
    })
  }

  $('body')
    .off('click.open-json-modal')
    .on('click.open-json-modal', 'a[data-json-link]', function (e) {
      var $overlay = $('<div id="lime-json-modal"></div>')
        .css({
          background: '#fff',
          border: '10px solid rgba(0,0,0,.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 999999,
          padding: 10,
          overflow: 'auto'
        })
        .appendTo('body')

      $('<a href="">Close</a>')
        .appendTo($overlay)
        .on('click', function (e) {
          $overlay.remove()
          e.preventDefault()
        })

      $overlay.append('<br><br>')

      var json = $(this).data('json-value')

      var $pre = $('<pre></pre>')
        .css({
          color: '#000',
          font: '14px "Lucida Console", Monaco, monospace'
        })
        .appendTo($overlay)
        .text(json)

      e.preventDefault()
    })

  $(document)
    .off('keyup.close-json-modal')
    .on('keyup.close-json-modal', function (e) {
      // esc key
      if (e.keyCode == 27 && $('#lime-json-modal').length) {
        $('#lime-json-modal').remove()
      }
    })

  updateImageColumns()
  //updateJsonColumns()
})()
