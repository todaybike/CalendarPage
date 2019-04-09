# tsvue5
CalendarPage



@types/qrcode/index.d.ts 수정사항

QRCodeOptions -> QRCodeRenderersOptions 
문법 체크를 위한 인터페이스 이름을 바꿔 줌.

/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, text: string | QRCodeSegment[], callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, text: string | QRCodeSegment[], options?: QRCodeRenderersOptions): Promise<any>;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, text: string | QRCodeSegment[], options: QRCodeRenderersOptions, callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[], callback: (error: Error, canvas: HTMLCanvasElement) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[], options?: QRCodeRenderersOptions): Promise<any>;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[], options: QRCodeRenderersOptions, callback: (error: Error, canvas: HTMLCanvasElement) => void): void;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], options?: QRCodeRenderersOptions): Promise<any>;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], options: QRCodeRenderersOptions, callback: (error: Error) => void): void;
