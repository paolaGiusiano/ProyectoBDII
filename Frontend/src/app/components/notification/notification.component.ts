import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  notifications: any[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(
      (data) => { 
        this.notifications = data;
      },
      (error) => {
        console.error('Error fetching notifications: ', error);
      }
    );
  }

  enviarCorreoAntesPartido(partido: any) {console.log("TS ANTES");
    this.notificationService.enviarCorreoAntesPartido(partido).subscribe(
      (response) => {
        console.log('Correo enviado correctamente.');
      },
      (error) => {
        console.error('Error enviando correo: ', error);
      }
    );
  }

  
}
