import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  // Scene properties
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;
  private arrows: THREE.ArrowHelper[] = [];
  public isRotating: boolean = false; // Track rotation state

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.onResize());
    this.initScene();
    this.onResize();
    this.animate();
  }

  // Initialize the scene, camera, and renderer
  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a cube geometry and material
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  // Animation loop
  private animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate the cube if isRotating is true
    if (this.isRotating) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  // Show arrows based on button clicked
  showArrow(direction: string) {
    let arrow: THREE.ArrowHelper;

    switch (direction) {
      case 'height':
        arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), this.cube.position, 1, 0xff0000); // Red arrow
        this.scene.add(arrow);
        this.arrows.push(arrow);
        setTimeout(() => this.removeArrow(arrow), 2000); // Remove after 2 seconds
        break;

      case 'width':
        arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.cube.position, 1, 0x00ff00); // Green arrow
        this.scene.add(arrow);
        this.arrows.push(arrow);
        setTimeout(() => this.removeArrow(arrow), 2000);
        break;

      case 'depth':
        arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), this.cube.position, 1, 0x0000ff); // Blue arrow
        this.scene.add(arrow);
        this.arrows.push(arrow);
        setTimeout(() => this.removeArrow(arrow), 2000);
        break;
    }
  }

  // Remove arrow from the scene
  private removeArrow(arrow: THREE.ArrowHelper) {
    this.scene.remove(arrow);
    const index = this.arrows.indexOf(arrow);
    if (index > -1) {
      this.arrows.splice(index, 1);
    }
  }

  // Toggle rotation state
  toggleRotation() {
    this.isRotating = !this.isRotating; 
  }

  // Resize the canvas when the window is resized
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Function to update the cube size dynamically based on user input
  updateCubeSize(newWidth: number, newHeight: number, widthInput?: HTMLInputElement, heightInput?: HTMLInputElement) {
    if (newWidth > 0 && newHeight > 0) {
      this.scene.remove(this.cube);
      const newGeometry = new THREE.BoxGeometry(newWidth, newHeight, 1); 
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(newGeometry, material);
      this.scene.add(this.cube);
      if (widthInput && heightInput) {
        widthInput.value = '';
        heightInput.value = '';
      }
    }
  }


  // Function to reset the cube to its default size (1x1x1)
  resetCube() {
    this.updateCubeSize(1, 1); 
  }
}
