import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';
export interface Service {
  name: string; 
    images?: string; // JSON array or object
   
    status?: string; 
}
export interface Professional {
  id:string;
  name: string; 
  gender:string;
    images?: string; // JSON array or object
    services?: Service[]; // JSON array or object
    IdMember?: string; // ID del miembro
    status?: string; 
}
@Injectable({
  providedIn: 'root',
})
export class RealtimeProfessionalsService implements OnDestroy {
  private pb: PocketBase;
  private professionalsSubject = new BehaviorSubject<any[]>([]);

  // Observable for components to subscribe to
  public professionals$: Observable<Professional[]> =
    this.professionalsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.conectavet.cl:8080');
    this.subscribeToProfessionals();
  }

  private async subscribeToProfessionals() {
    // (Optional) Authentication
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Subscribe to changes in any record of the 'professionals' collection
    this.pb.collection('professionals').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Initialize the list of professionals
    this.updateProfessionalsList();
  }

  private handleRealtimeEvent(event: any) {
    // Handle 'create', 'update', and 'delete' actions
    console.log(event.action);
    console.log(event.record);

    // Update the list of professionals
    this.updateProfessionalsList();
  }

  private async updateProfessionalsList() {
    // Get the updated list of professionals
    const records = await this.pb
      .collection('professionals')
      .getFullList(200 /* max number of records */, {
        sort: '-created', // Sort by creation date
      });

    // Reverse the order of the records
    const reversedRecords = records.reverse();
    
    this.professionalsSubject.next(reversedRecords);
  }

  ngOnDestroy() {
    // Unsubscribe when the service is destroyed
    this.pb.collection('professionals').unsubscribe('*');
  }
}
