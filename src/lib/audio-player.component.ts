import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, NgZone } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'nm-audio-player',
  template: `
<div class="container">
    <div class="info">
            {{nameSong}}
     </div>
    <div class="player">
        <div class="controls">
            <a href="http://localhost:4200/assets/toxycity.mp3" target="_blank" download><i color="primary" class="material-icons">save</i></a>
            
            <i class="material-icons play_pause" id="play_pause" (click)="play()">play_circle_outline</i>
        </div>
        <div class="tracksong">
            <p>{{currentTime}}</p>
            <mat-slider (input)="pitch($event)" [disabled]="disabled"
            [max]="max"
            [min]="min"
            [step]="1"
            [(ngModel)]="time"
            color="primary"></mat-slider>
            <p>{{totalTime}}</p>
        </div>
    </div>
</div>
  `,
  styles: [".material-icons{font-family:'Material Icons';font-weight:400;font-style:normal;font-size:24px;display:inline-block;line-height:1;text-transform:none;letter-spacing:normal;word-wrap:normal;white-space:nowrap;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:'liga'}div.container .info,div.container .tracksong p{font-family:Roboto,Helvetica}div.container{padding:12px;display:flex;flex-direction:row;background:rgba(90,90,90,.541)}div.container .info{align-self:center;font-style:italic;overflow:hidden;text-align:center;font-size:40px;flex-grow:1;max-width:200px}div.container .player{display:flex;flex-direction:column;flex-grow:3}div.container .tracksong{justify-content:center;display:flex;flex-direction:row;align-items:center;padding:0 10px}div.container .tracksong mat-slider{width:80%;margin:10px}div.container .controls{align-items:flex-end;justify-content:center;display:flex;flex-direction:row}div.container .tracksong p{font-size:14px}div.container .controls i{color:#f5f5f5;cursor:default;font-size:40px}div.container .controls i:hover{cursor:default;color:#cdd0d1}div.container .controls .play_pause{margin-left:12px}@media(max-width:700){div.container .controls i{margin-top:5px;cursor:default;font-size:38px}div.container .controls i.play_pause:hover{font-size:40px!important;margin-left:8px!important}}"]
})
export class AudioPlayer implements OnInit,OnChanges {


  @Input() track : any;
  @Input() disabled = false;

  public audio : any;
  public url : any;

  public onProcess;
  public currentTime = "0:00";
  public totalTime = "0:00";
  
  public max = 100;
  public min = 0;
  public time = 0;
  public nameSong = "";


  constructor(public zone : NgZone) {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    
    const data : SimpleChange = changes.track;
    console.log(data);

    if(data.previousValue != undefined){
      this.disabled = true;
      this.reStartVariables();
      this.audio = new Audio(data.currentValue.url);
      let onLoad = function(meta){     
        this.disabled = false;   
        let duration = meta.path[0].duration;
        var totalSeconds = (Math.floor(duration % 60) < 10 ? '0' : '') + Math.floor(duration % 60);
        var totalMinutes = Math.floor(duration / 60);
        this.max = duration;
        this.totalTime = totalMinutes + ":" + totalSeconds ;
        this.url = meta.path[0].currentSrc;
        let info = this.url.split("/");
        this.nameSong = info[info.length-1].split(".")[0];
              
      };
      this.audio.onloadedmetadata = onLoad.bind(this);

    }
  }
  
  play(){
    console.log(this.audio.duration);
    console.log(this.audio.currentTime);
    
    let playButton = <HTMLElement>document.getElementById("play_pause");

    if(this.audio.paused){
      playButton.innerHTML = "pause_circle_outline"
      this.onProcess = setInterval(()=>{
        this.updateTime();
      },1000);
      this.audio.play();
    }else{      
      clearInterval(this.onProcess);
      playButton.innerHTML = "play_circle_outline"
      this.audio.pause();
    }
    
  }
  reStartVariables(){
    clearInterval(this.onProcess);
    this.audio.pause();
    let playButton = <HTMLElement>document.getElementById("play_pause");
    playButton.innerHTML = "play_circle_outline";
    this.time = 0;
    this.currentTime = "0:00";
    this.totalTime = "0:00";
  }
  updateTime(){
    var currentSeconds = (Math.floor(this.audio.currentTime % 60) < 10 ? '0' : '') + Math.floor(this.audio.currentTime % 60);
    var currentMinutes = Math.floor(this.audio.currentTime / 60);
    this.currentTime = currentMinutes+":"+currentSeconds;
    this.time++;
    this.min = 0;
    
  }

  pitch(event: any) {
    clearInterval(this.onProcess);
    let playButton = <HTMLElement>document.getElementById("play_pause");
    this.audio.currentTime = event.value;
    this.onProcess = setInterval(()=>{
      this.updateTime();
    },1000);
    this.audio.play();
    playButton.innerHTML = "pause_circle_outline"
  }

  ngOnInit() {
    console.log(this.track);
    
    let onLoad = function(meta){
      console.log(meta);
      
      let duration = meta.path[0].duration;
      var totalSeconds = (Math.floor(duration % 60) < 10 ? '0' : '') + Math.floor(duration % 60);
      var totalMinutes = Math.floor(duration / 60);
      this.max = duration;
      this.totalTime = totalMinutes + ":" + totalSeconds ;
      this.url = meta.path[0].currentSrc;
      let info = this.url.split("/");
      this.nameSong = info[info.length-1].split(".")[0];
            
    };

    let onEnded = function(){
      this.time = 0;
      this.currentTime = "0:00";
      clearInterval(this.onProcess);
    };

    if(this.track != null){
      this.audio = new Audio(this.track.url);
      
      this.audio.onloadedmetadata = onLoad.bind(this);
      this.audio.onended = onEnded.bind(this);
    }
  }

}
