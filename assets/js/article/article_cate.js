let layer = layui.layer,
    form = layui.form,
    indexAdd = null,
    indexEdit = null;

initArticleCate();

// 初始化文章分类表格
function initArticleCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: (res) => {
            let htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
        }
    });
}

// 监听添加类别 click事件
$('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-add').html(),
    });
})


// 监听添加类别表单 submit事件
$('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('添加文章分类失败！');
            }
            layer.msg('添加文章分类成功！');
            initArticleCate();
            layer.close(indexAdd);
        }
    })
})

// 监听 编辑 click事件
$('tbody').on('click', '#btnEditCate', function () {
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html(),
    });
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/my/article/cates/' + id,
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('获取文章分类数据失败！');
            }
            form.val('form-edit', res.data);
        }
    })
});

// 监听 编辑 submit事件
$('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('更新分类信息失败！');
            }
            layer.msg('更新文章分类成功！');
            initArticleCate();
            layer.close(indexEdit);
        }
    })
});

// 监听 删除 click事件
$('tbody').on('click', '#btnDeleteCate', function () {
    let id = $(this).attr('data-id');
    layer.confirm('确定删除？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + id,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败！');
                }
                layer.msg('删除文章分类成功！')
                initArticleCate();
            }
        });
        layer.close(index);
    });



})