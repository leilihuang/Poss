define(
    [],
    function () {
        var tpl={
            Table:['<div class="tab-pane active cont" id="${href}">',
                '<table class="table table-bordered table-hover">',
                '<thead>',
                '<tr>',
                '<th>${head.title1}</th>',
                '<th>${head.title2}</th>',
                '<th>${head.title3}</th>',
                '</tr>',
                '</thead>',
                '<tbody>',
                '{@each body1 as it,index}',
                ' <tr>',
                ' <td>${it.tab1} </td>',
                ' <td>${it.tab2} </td>',
                ' <td>${it.tab3} </td>',
                ' </tr>',
                '{@/each}',
                '</tbody>',
                '</table>',
                '</div>'].join(''),
            tab: function (data) {
                var tab=juicer(this.Table, data);
                return tab;
            }
        }
        return tpl;
    }
)