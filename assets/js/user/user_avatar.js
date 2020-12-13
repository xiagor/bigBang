let layer = layui.layer;

// 1.1 获取裁剪区域的 DOM 元素
let $image = $('#image');
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
};
// 1.3 创建裁剪区域
$image.cropper(options);

$('#btnChooseImage').on('click', function () {
    $('#file').click();
})

$('#file').on('change', function (e) {
    let fileList = e.target.files;
    if (fileList.length === 0) {
        return layer.msg('请选择一张图片！');
    }
    let imgURL = URL.createObjectURL(fileList[0]);
    $image
        .cropper('destroy')
        .attr('src', imgURL)
        .cropper(options);
});

$('#btnUpload').on('click', function () {
    let dataURL = $image
        .cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        })
        .toDataURL('image/png');
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('更新头像失败！');
            }
            layer.msg('更换头像成功！');
            window.parent.getUserInfo();
        }
    })
})