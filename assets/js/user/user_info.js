let form = layui.form,
    layer = layui.layer;

initUserInfo();

// 表单验证
form.verify({
    nickname: (value) => {
        if (value.length > 6) {
            return '昵称长度必须在 1 ~ 6 个字符之间！';
        }
    }
})

// 初始化用户信息
function initUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            form.val('formUserInfo', res.data);
        }
    })
}

// 重置表单的数据
$('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
});

$('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('更新用户信息失败！');
            }
            layer.msg('更新用户信息成功！');
            window.parent.getUserInfo();
        }
    })
});