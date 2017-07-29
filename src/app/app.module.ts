import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider, SQLiteMock } from '../providers/database/database';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ViewPage } from '../pages/view/view';
import { GamePage } from '../pages/game/game';
import { InitDataPage } from '../pages/init-data/init-data';
import { ScriptProvider } from '../providers/script/script';
import { NavButtonsComponent } from '../components/nav-buttons/nav-buttons';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ViewPage,
    InitDataPage,
    GamePage,
    NavButtonsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ViewPage,
    InitDataPage,
    GamePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide:SQLite, useClass: SQLiteMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    ScriptProvider
  ]
})
export class AppModule {}
