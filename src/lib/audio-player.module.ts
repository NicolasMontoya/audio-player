import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AudioPlayer } from './audio-player.component';
import {MatSliderModule} from '@angular/material/slider';


@NgModule({
  imports: [ MatSliderModule, FormsModule
  ],
  declarations: [AudioPlayer],
  exports: [AudioPlayer]
})
export class AudioPlayerModule { }
