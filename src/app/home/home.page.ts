import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonText, IonLabel, IonRange, IonIcon, IonProgressBar, IonBadge, IonButtons
} from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonItem, IonInput, IonButton, IonLabel, IonRange, IonIcon, IonBadge, IonButtons
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

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  startNewGame() {
    this.score = 0;
    this.currentIndex = 0;
    this.dataService.getQuestions(this.totalQuestions, 1, this.numRows).subscribe({
      next: (res: any) => {
        this.questions = res.questions;
        this.runSequence();
      },
      error: (err) => alert("Engine waking up... please wait 20 seconds and try again.")
    });
  }

  async runSequence() {
    this.gameState = 'FLASHING';
    this.userAnswer = null;
    const problem = this.questions[this.currentIndex].problem;
    for (let num of problem) {
      this.currentFlashNumber = num > 0 ? `+${num}` : `${num}`;
      await new Promise(r => setTimeout(r, this.displaySpeed));
      this.currentFlashNumber = "";
      await new Promise(r => setTimeout(r, 100));
    }
    this.gameState = 'INPUT';
  }

  submitAnswer() {
    this.correctAnswer = this.questions[this.currentIndex].answer;
    if (Number(this.userAnswer) === this.correctAnswer) { this.score++; }
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

  goToMenu() { this.gameState = 'MENU'; }
}
