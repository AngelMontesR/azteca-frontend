import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptService } from '../../services/encrypt.service';

/**
 * Componente principal que implementa el reconocimiento de voz
 * para capturar y mostrar el nombre del usuario.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** Nombre capturado por voz o entrada manual */
  nombre: string = '';

  /** Máximo número de caracteres permitidos */
  maxCaracteres: number = 15;

  /** Indica si el reconocimiento de voz está activo */
  isRecording: boolean = false;

  /** Indica si el navegador soporta la API de voz */
  isApiSupported: boolean = true;

  /** Instancia del reconocimiento de voz */
  recognition: any;

  constructor(private zone: NgZone, private encryptService: EncryptService) {}

  /** Inicializa el reconocimiento de voz al cargar el componente */
  ngOnInit(): void {
    this.initSpeechRecognition();
  }

  /** Configura el reconocimiento de voz y sus eventos */
  initSpeechRecognition(): void {
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

      // Actualiza el valor dentro del contexto de Angular
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

  /** Limpia y valida el texto capturado */
  processText(text: string): void {
    let cleanedName = text.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\u00E0-\u00FC0-9\s]/g, '');
    if (cleanedName.length > this.maxCaracteres) {
      cleanedName = cleanedName.substring(0, this.maxCaracteres);
    }
    this.nombre = cleanedName;
  }

  /** Inicia o detiene el reconocimiento de voz */
  toggleVoiceRecognition(): void {
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

  /** Maneja el evento de cambio en el input manual */
  onInputChange(value: string): void {
    if (!this.isRecording) {
      this.processText(value);
    }
  }

  /** Envía el nombre al backend para encriptación */
  comenzar(): void {
    if (this.nombre.trim().length === 0) {
      alert('Por favor, ingresa o dicta un nombre para continuar.');
      return;
    }

    this.encryptService.encrypt(this.nombre.trim()).subscribe({
      next: (encryptedName) => {
        console.log('Nombre encriptado recibido:', encryptedName.data);
        alert(`Nombre encriptado: ${encryptedName.data}`);
      },
      error: (error) => {
        console.error('Error al encriptar el nombre:', error);
      }
    });
  }
}
