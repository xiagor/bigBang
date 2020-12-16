$(function () {
    let layer = layui.layer,
        form = layui.form,
        art_state = '已发布',
        artId = new URLSearchParams(location.search).get('id'),
        options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview',
            autoCropArea: 1
        },
        $image = $('#image');


    getCateOpt();

    if (!artId) {
        // 初始化富文本
        // initEditor();
        // 初始化裁剪区域
        options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        };
        $image.cropper(options);
    }



    // 获取文章类别下拉选项
    function getCateOpt() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！');
                }
                let htmlStr = template('tpl-cateOpt', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
                // 并获取文章内容
                if (artId) {
                    getArticleById();
                }

            }
        })
    }

    // 根据id获取文章内容并渲染
    function getArticleById() {
        $.ajax({
            type: 'GET',
            url: '/my/article/' + artId,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取文章详情失败！');
                }
                // 赋值
                form.val('form-pub', res.data);

                // 初始化富文本
                // initEditor();

                // 基本裁剪效果   
                $image.attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img);

                $image.cropper(options);
            }
        })
    }


    // 监听选择图片click
    $('#btnChooseImage').on('click', function (e) {
        e.preventDefault();
        $('#coverFile').click();
    });

    $('#coverFile').on('change', function (e) {
        let files = e.target.files;
        if (files.length === 0) {
            return;
        }
        let newImageURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });

    // 监听表单提交submit
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        // 将jquery对象$(this)，转换为dom对象formData
        let formData = new FormData($(this)[0]);

        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                formData.append('cover_img', blob);
                formData.append('state', art_state);
                if (!formData.get('Id')) {
                    formData.delete('Id')
                }
                publishArticle(formData);
            });
    });

    // 发布和更新文章
    function publishArticle(formData) {
        let url = '/my/article/add'
        if (formData.get('Id')) {
            url = '/my/article/edit';
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！', {
                    time: 1000
                }, function () {
                    window.parent.$('#article_list')[0].click();
                });

            }
        })
    }

})