import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import confetti from 'canvas-confetti'; // We'll add this for the win!

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonText, IonLabel, IonRange, IonIcon,
  IonProgressBar, IonBadge, IonButtons, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { addIcons } from 'ionicons';
import { star, trophy, checkmarkCircle, closeCircle, play, arrowForwardOutline, refreshOutline, close } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonItem, IonButton, IonLabel, IonRange, IonIcon, IonBadge, IonButtons, IonSelect, IonSelectOption
  ],
})


// ... (keep imports the same)

export class HomePage {
  streak: number = 0;
  isCountdown: boolean = false;
  countdownValue: string | number = '';
  xp: number = 0;
  level: string = 'DIRECT';
  numRows: number = 3;
  displaySpeed: number = 1000;
  totalQuestions: number = 5;
  questions: any[] = [];
  currentIndex: number = 0;
  gameState: 'MENU' | 'FLASHING' | 'INPUT' | 'FEEDBACK' | 'RESULT' = 'MENU';
  currentFlashNumber: string = "";
  currentFlashValue: number = 0;
  userAnswer: string = ""; // Always keep as string
  correctAnswer: number = 0;
  score: number = 0;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dataService: DataService) {
    addIcons({ star, trophy, checkmarkCircle, closeCircle, play, arrowForwardOutline, refreshOutline, close });
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.6;
      utterance.lang = 'en-US';
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  async startNewGame() {
    this.score = 0;
    this.currentIndex = 0;
    this.streak = 0;
    this.dataService.getQuestions(this.totalQuestions, 1, this.numRows).subscribe({
      next: async (res: any) => {
        this.questions = res.questions;
        await this.showCountdown();
        this.runSequence();
      },
      error: () => alert("Engine waking up... please wait.")
    });
  }

  async showCountdown() {
    this.gameState = 'FLASHING';
    this.isCountdown = true;
    const tones = ['3', '2', '1', 'Go'];
    for (let t of tones) {
      this.countdownValue = t;
      await this.speak(t);
      await new Promise(r => setTimeout(r, 100));
    }
    this.isCountdown = false;
  }

  async runSequence() {
    this.gameState = 'FLASHING';
    this.userAnswer = ""; // FIX: Reset to empty string, NOT null
    const problem = this.questions[this.currentIndex].problem;

    for (let num of problem) {
      this.currentFlashValue = num;
      this.currentFlashNumber = num > 0 ? `+${num}` : `${num}`;
      const voiceText = num > 0 ? `plus ${num}` : `minus ${Math.abs(num)}`;

      await this.speak(voiceText);
      await new Promise(r => setTimeout(r, 200));
      this.currentFlashNumber = "";
      await new Promise(r => setTimeout(r, 100));
    }
    this.gameState = 'INPUT';
  }

  // --- KEYBOARD LOGIC FIX ---
  addToAnswer(val: number) {
    this.speak(val.toString());
    // Limit to 5 digits so it doesn't break the UI
    if (this.userAnswer.length < 5) {
      this.userAnswer += val.toString();
    }
  }

  clearAnswer() {
    this.userAnswer = "";
  }

  submitAnswer() {
    this.correctAnswer = this.questions[this.currentIndex].answer;

    // Compare number version of string to the answer
    if (Number(this.userAnswer) === this.correctAnswer) {
      this.score++;
      this.streak++;
      this.xp += (10 * this.streak);
      this.celebrate();
    } else {
      this.streak = 0;
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

  celebrate() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  goToMenu() {
    window.speechSynthesis.cancel();
    this.gameState = 'MENU';
  }
}
