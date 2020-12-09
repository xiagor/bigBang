$(function () {
    $('#link_reg').on('click', () => {
        $('.loginBox').hide();
        $('.regBox').show();
    })

    $('#link_login').on('click', () => {
        $('.regBox').hide();
        $('.loginBox').show();
    })

    let form = layui.form;
    let layer = layui.layer;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码6到12位，且不能出现空格'],
        repwd: (value) => {
            let pwd = $('.regBox [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });
    // 注册提交事件
    $('#form_reg').on('submit', (e) => {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录');
                $('#link_login').click();
            }
        })
    })
    // 登录提交事件
    $('#form_login').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $('#form_login').serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})