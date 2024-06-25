import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { BlogComponent } from "./components/blog/blog.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, BlogComponent, NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public counter: number = 0;

    add() { this.counter++; }
    remove() { this.counter--; }
}
