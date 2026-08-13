import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonText, IonLabel, IonRange, IonIcon,
  IonProgressBar, IonBadge, IonButtons, IonBackButton, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, trophy, checkmarkCircle, closeCircle, play, arrowForwardOutline, refreshOutline, home, close } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonItem, IonInput, IonButton, IonText, IonLabel, IonRange, IonIcon,
    IonProgressBar, IonBadge, IonButtons, IonSelect, IonSelectOption
  ],
})
export class HomePage implements OnInit {
  numRows: number = 3;
  displaySpeed: number = 1000;
  totalQuestions: number = 5;
  questions: any[] = [];
  currentIndex: number = 0;
  gameState: 'MENU' | 'FLASHING' | 'INPUT' | 'FEEDBACK' | 'RESULT' = 'MENU';
  currentFlashNumber: string = "";
  userAnswer: number | null = null;
  correctAnswer: number = 0;
  score: number = 0;
  // New   Settings
  level: string = 'DIRECT';
  xp: number = 0; // Brain Points

  // Sounds
  correctSound = new Audio('assets/sounds/correct.mp3');
  wrongSound = new Audio('assets/sounds/wrong.mp3');
  tickSound = new Audio('assets/sounds/tick.mp3');
  constructor(private http: HttpClient) {
    // Added 'home' and 'close' icons here
    addIcons({ star, trophy, checkmarkCircle, closeCircle, play, arrowForwardOutline, refreshOutline, home, close });
  }

  ngOnInit() {}

  startNewGame() {
    this.score = 0;
    this.currentIndex = 0;
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.http.get(`http://127.0.0.1:8000/api/practice?questions=${this.totalQuestions}&digits=1&rows=${this.numRows}`)
      .subscribe((res: any) => {
        this.questions = res.questions;
        this.runSequence();
      });
  }

  async runSequence() {
    this.gameState = 'FLASHING';
    const problem = this.questions[this.currentIndex].problem;

    for (let num of problem) {
      this.tickSound.play().catch(() => {}); // Play tick sound
      this.currentFlashNumber = num > 0 ? `+${num}` : `${num}`;
      await new Promise(r => setTimeout(r, this.displaySpeed));
      this.currentFlashNumber = "";
      await new Promise(r => setTimeout(r, 100));
    }
    this.gameState = 'INPUT';
  }


  submitAnswer() {
    this.correctAnswer = this.questions[this.currentIndex].answer;
    if (Number(this.userAnswer) === this.correctAnswer) {
      this.score++;
      this.xp += 10; // Earn 10 XP
      this.correctSound.play().catch(() => {});
    } else {
      this.wrongSound.play().catch(() => {});
    }
    this.gameState = 'FEEDBACK';
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.runSequence();
    } else {
      this.gameState = 'RESULT';
    }
  }

  // NEW: Function to go back to Menu
  goToMenu() {
    this.gameState = 'MENU';
    this.questions = [];
  }
}
