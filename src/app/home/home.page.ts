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
    IonItem, IonInput, IonButton, IonLabel, IonRange, IonIcon, IonBadge, IonButtons, IonSelect, IonSelectOption
  ],
})
export class HomePage {
  // These were missing!
  isCountdown: boolean = false;
  countdownValue: string | number = '';
  xp: number = 0;
  level: string = 'DIRECT';

  numRows: number = 3;
  displaySpeed: number = 1500;
  totalQuestions: number = 5;
  questions: any[] = [];
  currentIndex: number = 0;
  gameState: 'MENU' | 'FLASHING' | 'INPUT' | 'FEEDBACK' | 'RESULT' = 'MENU';
  currentFlashNumber: string = "";
  userAnswer: number | null = null;
  correctAnswer: number = 0;
  score: number = 0;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dataService: DataService) {
    addIcons({ star, trophy, checkmarkCircle, closeCircle, play, arrowForwardOutline, refreshOutline, close });
  }


  // 1. Text-to-Speech Function
  // Add this helper to the top of your class or inside the speak method
  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      // 1. Cancel any current speech (prevents overlapping)
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.5; // Faster for Abacus speed
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // 2. This is the magic: resolve the promise only when the voice finishes
      utterance.onend = () => {
        resolve();
      };

      // 3. If there's an error, don't get stuck
      utterance.onerror = () => {
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // 2. Updated Start Game with Countdown
  async startNewGame() {
    this.score = 0;
    this.currentIndex = 0;

    this.dataService.getQuestions(this.totalQuestions, 1, this.numRows).subscribe({
      next: async (res: any) => {
        this.questions = res.questions;
        await this.showCountdown();
        this.runSequence();
      },
      error: (err) => alert("Engine waking up... please wait.")
    });
  }

  async showCountdown() {
    this.gameState = 'FLASHING';
    this.isCountdown = true;
    const tones = ['3', '2', '1', 'Go'];

    for (let t of tones) {
      this.countdownValue = t;
      await this.speak(t); // Wait for the voice to say the number
      // Small extra pause for rhythm
      await new Promise(r => setTimeout(r, 200));
    }
    this.isCountdown = false;
  }

  // 3. Updated Sequence with Voice
  async runSequence() {
    this.gameState = 'FLASHING';
    this.userAnswer = null;
    const problem = this.questions[this.currentIndex].problem;

    for (let num of problem) {
      // Determine the text to show and say
      const voiceText = num > 0 ? `plus ${num}` : `minus ${Math.abs(num)}`;
      this.currentFlashNumber = num > 0 ? `+${num}` : `${num}`;

      // AWAIT the voice: the loop pauses here until the voice finishes speaking
      await this.speak(voiceText);

      // Optional: Keep the number on screen for a split second longer after voice ends
      await new Promise(r => setTimeout(r, 200));

      // Hide number before the next one
      this.currentFlashNumber = "";
      await new Promise(r => setTimeout(r, 100));
    }

    this.gameState = 'INPUT';
  }

  // 4. Celebration Logic
  submitAnswer() {
    this.correctAnswer = this.questions[this.currentIndex].answer;
    if (Number(this.userAnswer) === this.correctAnswer) {
      this.score++;
      this.xp += 10;
      this.celebrate(); // Trigger Confetti
    }
    this.gameState = 'FEEDBACK';
  }

  celebrate() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffce00', '#ff4961', '#2dd36f']
    });
  }
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.runSequence();
    } else {
      this.gameState = 'RESULT';
    }
  }

  goToMenu() {
    window.speechSynthesis.cancel(); // STOPS all talking immediately
    this.gameState = 'MENU';
  }
}
