# tsvue5
CalendarPage


### 추가된 라이브러리는 다음과 같습니다.
npm install --save qrcode<br>
npm install --save @types/qrcode<br>
npm install --save jsbarcode<br>


@types/qrcode 를 설치해도 tslint 에서 지속적으로 에러를 내는데, 옵션으로 들어가는 부분이 잘못 된 듯 한다. @types/qrcode/index.d.ts 파일의 아래 부분을 수정했다.<br>

@types/qrcode/index.d.ts 수정사항
---------------------------------------------

QRCodeOptions -> QRCodeRenderersOptions <br>
문법 체크를 위한 인터페이스 이름을 바꿔 줌.<br>
<pre style="font-size:8pt">
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, 
	text: string | QRCodeSegment[],
	callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, 
	text: string | QRCodeSegment[],
	options?: <strong>QRCodeRenderersOptions</strong>): Promise<any>;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(canvasElement: HTMLCanvasElement, 
	text: string | QRCodeSegment[],
	options: <strong>QRCodeRenderersOptions</strong>, 
	callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[],
	callback: (error: Error, canvas: HTMLCanvasElement) => void): void;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[], 
	options?: <strong>QRCodeRenderersOptions</strong>): Promise<any>;
/**
 * Draws qr code symbol to canvas.
 */
export function toCanvas(text: string | QRCodeSegment[], 
	options: <strong>QRCodeRenderersOptions</strong>, 
	callback: (error: Error, canvas: HTMLCanvasElement) => void): void;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], 
	callback: (error: Error) => void): void;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], 
	options?: <strong>QRCodeRenderersOptions)</strong>: Promise<any>;
/**
 * Draws qr code symbol to node canvas.
 */
export function toCanvas(canvas: any, text: string | QRCodeSegment[], 
	options: <strong>QRCodeRenderersOptions</strong>, 
	callback: (error: Error) => void): void;
</pre>