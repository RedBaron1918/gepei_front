import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
export type MaterialButtonType =
  | 'basic'
  | 'raised'
  | 'stroked'
  | 'flat'
  | 'icon'
  | 'fab'
  | 'mini-fab'
  | 'extended-fab';
export type MaterialButtonColor = 'primary' | 'accent' | 'warn' | undefined;

@Component({
  selector: 'app-material-button',
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatButtonModule, CommonModule],
  template: `
    <ng-container *ngIf="['basic', 'raised', 'stroked', 'flat'].includes(type)">
      <button
        mat-button
        [ngClass]="getButtonClass()"
        [color]="color"
        [disabled]="disabled"
        (click)="onClick.emit($event)"
        [attr.aria-label]="ariaLabel"
      >
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
        {{ text }}
      </button>
    </ng-container>

    <button
      *ngIf="type === 'icon'"
      mat-icon-button
      [color]="color"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [attr.aria-label]="ariaLabel"
    >
      <mat-icon>{{ icon }}</mat-icon>
    </button>

    <button
      *ngIf="type === 'fab'"
      mat-fab
      [color]="color"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [attr.aria-label]="ariaLabel"
    >
      <mat-icon>{{ icon }}</mat-icon>
    </button>

    <button
      *ngIf="type === 'mini-fab'"
      mat-mini-fab
      [color]="color"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [attr.aria-label]="ariaLabel"
    >
      <mat-icon>{{ icon }}</mat-icon>
    </button>

    <button
      *ngIf="type === 'extended-fab'"
      mat-fab
      extended
      [color]="color"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [attr.aria-label]="ariaLabel"
    >
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      {{ text }}
    </button>
  `,
  styles: [
    `
      button {
        margin: 8px;
      }
      mat-icon {
        margin-right: 8px;
      }
    `,
  ],
})
export class MaterialButtonComponent {
  @Input() type: MaterialButtonType = 'basic';
  @Input() color: MaterialButtonColor;
  @Input() text: string = '';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() ariaLabel?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClass(): string {
    switch (this.type) {
      case 'raised':
        return 'mat-raised-button';
      case 'stroked':
        return 'mat-stroked-button';
      case 'flat':
        return 'mat-flat-button';
      default:
        return 'mat-button';
    }
  }
}
