import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
const USERNAME = 'namasaya';

@Component({
  selector: 'app-barang',
  templateUrl: './barang.page.html',
  styleUrls: ['./barang.page.scss'],
})
export class BarangPage implements OnInit {
  public namauser = '';
  
  constructor(public _apiService: ApiService, private modal:ModalController, private authService: AuthenticationService, private alertController:
    AlertController, private router: Router
    ) { }
      dataBarang: any = [];
      modal_tambah = false;
      id : any;
      nama : any;
      stok : any;

  ngOnInit() {
    this.cekSesi();
    console.log(this.namauser);
    this.getBarang();
    }
    getBarang() {
    this._apiService.tampil('tampil.php').subscribe({
    next: (res: any) => {
    console.log('sukses', res);
    this.dataBarang = res;
    },
    error: (err: any) => {
    console.log(err);
    },
    })
    }

    async cekSesi() {
      const ambilNama = localStorage.getItem(USERNAME);
      if (ambilNama) {
        let username = ambilNama;
        this.namauser = username;
      } else {
        this.authService.logout();
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    }
    logout() {
      this.alertController.create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            }
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              //jika tekan yakin
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            }
          }
        ]
      }).then(res => {
        res.present();
      });
    }
    reset_model() {
      this.id = null;
      this.nama = '';
      this.stok = '';
      }
      open_modal_tambah(isOpen: boolean) {
        this.modal_tambah = isOpen;
        this.reset_model();
        this.modal_tambah = true;
        this.modal_edit = false;
        }
      cancel() {
      this.modal.dismiss();
      this.modal_tambah = false;
      this.reset_model();
      }

      tambahBarang() {
        if (this.nama != '' && this.stok != '') {
        let data = {
        nama: this.nama,
        stok: this.stok,
        }
        this._apiService.tambah(data, '/tambah.php')
        .subscribe({
        next: (hasil: any) => {
        this.reset_model();
        console.log('berhasil tambah barang');
        this.getBarang();
        this.modal_tambah = false;
        this.modal.dismiss();
        },
        error: (err: any) => {
        console.log('gagal tambah barang');
        }
        })
        } else {
        console.log('gagal tambah barang karena masih ada data yg kosong');
        }
        }

        hapusBarang(id: any) {
          this._apiService.hapus(id,
          '/hapus.php?id=').subscribe({
          next: (res: any) => {
          console.log('sukses', res);
          this.getBarang();
          console.log('berhasil hapus data');
          },
          error: (error: any) => {
          console.log('gagal');
          }
          })
          }

          ambilBarang(id: any) {
            this._apiService.lihat(id,
            '/lihat.php?id=').subscribe({
            next: (hasil: any) => {
            console.log('sukses', hasil);
            let barang = hasil;
            this.id = barang.id;
            this.nama = barang.nama;
            this.stok = barang.stok;
            },
            error: (error: any) => {
            console.log('gagal ambil data');
            }
            })
            }

            modal_edit = false;
            
              open_modal_edit(isOpen: boolean, idget: any) {
              this.modal_edit = isOpen;
              this.id = idget;
              console.log(this.id);
              this.ambilBarang(this.id);
              this.modal_tambah = false;
              this.modal_edit = true;
              }

              editBarang() {
                let data = {
                id: this.id,
                nama: this.nama,
                stok: this.stok
                }
                this._apiService.edit(data, '/edit.php')
                .subscribe({
                next: (hasil: any) => {
                console.log(hasil);
                this.reset_model();
                this.getBarang();
                console.log('berhasil edit barang');
                this.modal_edit = false;
                this.modal.dismiss();
                },
                error: (err: any) => {
                console.log('gagal edit barang');
                }
                })
                }
}
