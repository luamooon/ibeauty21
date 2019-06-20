import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription, from } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
private products = new Array<Product>();
private productsSubscription: Subscription;
 private loading: any;

 

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
    ) {
    this.productsSubscription = this.productService.getProducts().subscribe(data =>{
      this.products = data;
      
    });
  }
  
  ngOnInit() {}

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    } finally{
      this.loading.dismiss();
    }

  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({message:'Por favor, aguarde...' });
    return this.loading.present();
  }
  async deleteProduct(id: string) {
    try{
     await this.productService.deleteProduct(id);
    } catch(error) {
      this.presentToast('Usuario invalido para ação');
    }
  }
 
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000});
    toast.present();
  }
}