import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nombre: string = '';
  maxCaracteres: number = 15;
  isRecording: boolean = false;
  isApiSupported: boolean = true;
  recognition: any;

  constructor(private zone: NgZone) {} // ✅ inyectamos NgZone

  ngOnInit() {
    this.initSpeechRecognition();
  }

  /**
   * Inicializa el reconocimiento de voz.
   */
  initSpeechRecognition() {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.isApiSupported = false;
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    this.recognition = new SpeechRecognitionClass();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-MX';

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript + ' ';
        }
      }

      const textToShow = (finalTranscript || interimTranscript).trim();

      console.log('Reconocido:', textToShow);

      // ✅ Esto es clave: avisamos a Angular que actualice la vista
      this.zone.run(() => {
        this.processText(textToShow);
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => (this.isRecording = false));
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error de reconocimiento:', event.error);
      this.zone.run(() => (this.isRecording = false));
      alert(`Error de micrófono: ${event.error}. Revisa permisos del navegador.`);
    };
  }

  processText(text: string) {
    // Permite letras con acento, ñ, Ñ, números y espacios
    let cleanedName = text.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\u00E0-\u00FC0-9\s]/g, '');

    if (cleanedName.length > this.maxCaracteres) {
      cleanedName = cleanedName.substring(0, this.maxCaracteres);
    }

    this.nombre = cleanedName;
  }


  toggleVoiceRecognition() {
    if (!this.isApiSupported) {
      alert('Tu navegador no soporta el reconocimiento de voz.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.nombre = '';
      this.isRecording = true;
      this.recognition.start();
    }
  }

  onInputChange(value: string) {
    if (!this.isRecording) {
      this.processText(value);
    }
  }

  comenzar() {
    if (this.nombre.trim().length === 0) {
      alert('Por favor, ingresa o dicta un nombre para continuar.');
      return;
    }
    console.log(`Enviando al backend para encriptar: ${this.nombre}`);
  }
}
