import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

declare var google;
var markers = [];

var locations = [
  {title: '38ª Delegacia de Polícia', location: {lat: -15.815542, lng: -48.017748}},
  {title: 'Superbom Supermercado', location: {lat: -15.816407, lng: -48.015820}},
  {title: 'Cond. Por do Sol', location: {lat: -15.815848, lng: -48.018634}}
];


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: any;
  private URL: string = "https://eduferr.pythonanywhere.com/shibe/default/api/materia.json";
  /*https://http://127.0.0.1:8000/shibe/default/index.json*/

  @ViewChild('map') mapElement: ElementRef;
  map: any;


  constructor(public navCtrl: NavController, public http: Http, public geolocation: Geolocation) {
    this
    .http
    .get(this.URL)
    .map(res => res.json().content)
    .subscribe(
      data => {
        this.posts = data;
        console.log("data:"+this.posts);
      },
      err => {
        console.log("erro:"+this.posts);
      }
    );
    console.log("saída:"+this.posts);



  }

  ionViewDidLoad(){
    this.loadMap();
  }




  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var largeInfowindow = new google.maps.InfoWindow();


      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }


      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }



  addMarker(){
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: locations[i].location,
        title: locations[i].title,
        id: i
      });
      //this.addInfoWindow(marker, "<h4>Information!</h4>");
      markers.push(marker);

      this.addInfoWindow(marker, "<h4>Information!</h4>");

      bounds.extend(markers[i].position);
    }
    this.map.fitBounds(bounds);
  }


  populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({

      content: '<div>' + marker.title + '</div>'
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });


  }

}
