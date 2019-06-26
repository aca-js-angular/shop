import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

// const EMPTY_DEFAULT_IMG = 'https://user.gadjian.com/static/images/personnel_boy.png';
const EMPTY_DEFAULT_IMG = 'assets/profile/uploadImg/1.png';


export const emitNewImage = new EventEmitter()

declare var $: any;
declare var swal: any;

@Injectable({
    providedIn: 'root'
})

export class jQueryImagesResize {


    public resizeJQuery(): void {
            
            // Start upload preview image
            $(".gambar").attr("src", EMPTY_DEFAULT_IMG);
            var $uploadCrop,
            tempFilename,
            rawImg,
            imageId;
        function readFile(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.upload-demo').addClass('ready');
                    $('#cropImagePop').modal('show');
                    rawImg = e.target['result'];
                }
                reader.readAsDataURL(input.files[0]);
            }
            else {
                swal("Sorry - you're browser doesn't support the FileReader API");
            }
        }

        $uploadCrop = $('#upload-demo').croppie({
            viewport: {
                width: 190,
                height: 200,
            },
            enforceBoundary: false,
            enableExif: true
        });
        $('#cropImagePop').on('shown.bs.modal', function () {
            // alert('Shown pop');
            $uploadCrop.croppie('bind', {
                url: rawImg
            }).then(function () {
                console.log('jQuery bind complete');
            });
        });

        $('.item-img').on('change', function () {
            imageId = $(this).data('id'); tempFilename = $(this).val();
            $('#cancelCropBtn').data('id', imageId); readFile(this);
        });
        $('#cropImageBtn').on('click', function (ev) {
            $uploadCrop.croppie('result', {
                type: 'base64',
                format: 'jpeg',
                size: { width: 190, height: 200 }
            }).then(function (resp) {
                // $('#item-img-output').attr('src', resp);
                emitNewImage.emit(resp)
                $('#cropImagePop').modal('hide');
            });
        });
        // End upload preview image
    }
}  