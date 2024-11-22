import { Component } from '@angular/core';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {
  accordions = [
    {
      id: 'collapseOne',
      header: 'Accordion Header One',
      content: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid...',
      expanded: true,
    },
    {
      id: 'collapseTwo',
      header: 'Accordion Header Two',
      content: 'Food truck quinoa nesciunt laborum eiusmod...',
      expanded: false,
    },
    {
      id: 'collapseThree',
      header: 'Accordion Header Three',
      content: '3 wolf moon officia aute, non cupidatat skateboard dolor brunch...',
      expanded: false,
    },
  ];
}
