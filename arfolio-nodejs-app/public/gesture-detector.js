// Component that detects and emits events for touch gestures

AFRAME.registerComponent("gesture-detector", {
    schema: {
      element: { default: "" }
    },
  
    init: function() {
      this.targetElement =
        this.data.element && document.querySelector(this.data.element);
  
      if (!this.targetElement) {
        this.targetElement = this.el;
      }
  
      this.internalState = {
        previousState: null
      };
  
      this.emitGestureEvent = this.emitGestureEvent.bind(this);
  
      this.targetElement.addEventListener("touchstart", this.emitGestureEvent);
  
      this.targetElement.addEventListener("touchend", this.emitGestureEvent);
  
      this.targetElement.addEventListener("touchmove", this.emitGestureEvent);
    },
  
    remove: function() {
      this.targetElement.removeEventListener("touchstart", this.emitGestureEvent);
  
      this.targetElement.removeEventListener("touchend", this.emitGestureEvent);
  
      this.targetElement.removeEventListener("touchmove", this.emitGestureEvent);
    },
  
    emitGestureEvent: function(event) {
      const currentState = this.getTouchState(event);
  
      const previousState = this.internalState.previousState;
  
      const gestureContinues =
        previousState &&
        currentState &&
        currentState.touchCount == previousState.touchCount;
  
      const gestureEnded = previousState && !gestureContinues;
  
      const gestureStarted = currentState && !gestureContinues;
  
      if (gestureEnded) {
        const eventName =
          this.getEventPrefix(previousState.touchCount) + "fingerend";
        this.el.emit(eventName, currentState);
      }
  
      if (gestureStarted) {
        const eventName =
          this.getEventPrefix(currentState.touchCount) + "fingerstart";
        this.el.emit(eventName, currentState);
      }
  
      if (gestureContinues) {
        const eventName =
          this.getEventPrefix(currentState.touchCount) + "fingermove";
        this.el.emit(eventName, currentState);
      }
  
      // Store the current state for the next frame
      this.internalState.previousState = currentState;
    },
  
    getTouchState: function(event) {
      if (event.touches.length === 1) {
        // Single finger touch
        return {
          touchCount: 1,
          x: event.touches[0].pageX,
          y: event.touches[0].pageY
        };
      } else if (event.touches.length === 2) {
        // Two finger touch
        return {
          touchCount: 2,
          x1: event.touches[0].pageX,
          y1: event.touches[0].pageY,
          x2: event.touches[1].pageX,
          y2: event.touches[1].pageY
        };
      } else {
        // No touch or more than two touches
        return {
          touchCount: 0
        };
      }
    },
  
    getEventPrefix: function(touchCount) {
      if (touchCount === 1) {
        return "one";
      } else if (touchCount === 2) {
        return "two";
      } else {
        return "";
      }
    }
  });
  