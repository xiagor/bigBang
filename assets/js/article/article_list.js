let layer = layui.layer,
    laypage = layui.laypage,
    form = layui.form;

// 定义初始化查询对象
let dataObj = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: '',
};

initTable();
initCateOption();

template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    let y = dt.getFullYear(),
        m = padZero(dt.getMonth() + 1),
        d = padZero(dt.getDate()),
        hh = padZero(dt.getHours()),
        mm = padZero(dt.getMinutes()),
        ss = padZero(dt.getSeconds());

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

// 补零函数
function padZero(n) {
    return n > 9 ? n : '0' + n;
}

// 初始化表格
function initTable() {
    $.ajax({
        type: 'GET',
        url: '/my/article/list',
        data: dataObj,
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            let htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
            renderPage(res.total);
        }
    })
}

// 获取分类下拉选项
function initCateOption() {
    $.ajax({
        type: "GET",
        url: '/my/article/cates',
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败！');
            }
            let htmlStr = template('tpl-cateOpt', res);
            $('[name = cate_id]').html(htmlStr);
            form.render();
        }
    })
}

// 监听 表单 submit事件
$('#form_search').on('submit', function (e) {
    e.preventDefault();
    dataObj.cate_id = $('[name=cate_id]').val();
    dataObj.state = $('[name=state]').val();
    initTable();
});

function renderPage(total) {
    laypage.render({
        elem: 'pageBox',
        count: total,
        limit: dataObj.pagesize,
        curr: dataObj.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 5, 10, 20],
        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function (obj, first) {
            dataObj.pagesize = obj.limit;
            dataObj.pagenum = obj.curr;
            if (!first) {
                initTable();
            }
        }
    });
}

$('tbody').on('click', '.btn-delete', function (e) {
    let id = $(this).attr('data-id'),
        len = $('.btn-delete').length;
    layer.confirm('确定删除？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            type: 'GET',
            url: '/my/article/delete/' + id,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('删除失败！')
                }
                layer.msg('删除成功！');
                if (len === 1) {
                    dataObj.pagenum = dataObj.pagenum === 1 ? 1 : dataObj.pagenum - 1;
                }
                initTable();
            }
        });
        layer.close(index);
    });
});

$('tbody').on('click', '.btn-edit', function () {
    let id = $(this).attr('data-id');
    location.href = 'article_pub.html?' + 'id=' + id;
})