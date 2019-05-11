import { MatIconModule, MatButtonModule, MatRippleModule, MatProgressSpinnerModule, MatProgressBarModule, MatBadgeModule, MatTooltipModule } from '@angular/material';
import { FaModule } from './fa-module/fa.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { HomeModule } from './home-module/home.module';
import { ProductsModule } from './products-module/products.module';
import { SharedModule } from './shared-module/shared.module';
import { AnimationModule } from './animation-module/animation.module';
import { MessengerModule } from './messenger-module/messenger.module';
// import { ConfirmModule } from './comfirm-module/confirm.module';


export const ProjectMainModules = [
    HomeModule,
    FaModule,
    ProductsModule,
    SharedModule,
    AnimationModule,
    MessengerModule,
  ];


export const FireBaseModules = [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    
];

export const MaterialDesignModules = [
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatTooltipModule,
];


