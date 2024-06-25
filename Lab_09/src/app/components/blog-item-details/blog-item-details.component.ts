import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blog-item-details',
  standalone: true,
  imports: [HttpClientModule],
  providers: [DataService],
  templateUrl: './blog-item-details.component.html',
  styleUrl: './blog-item-details.component.css'
})
export class BlogItemDetailsComponent implements OnInit {
  public image: string = '';
  public text: string = '';

  constructor(private service: DataService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
      let id: string = '';
      this.route.paramMap.subscribe((params: any) => {
        id = params.get('id');
      });

      this.service.getById(id).subscribe((res: any) => {
        this.image = res[0].image;
        this.text = res[0].text;
      })
  }
}
