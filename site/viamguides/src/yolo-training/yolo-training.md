author: HipsterBrown
id: yolo-training
summary: Train and deploy a custom YOLO object detection model
categories: Getting-Started, Developer
environments: web
status: Published 
feedback link: https://github.com/viam-devrel/viamcodelabs/issues
tags: Getting Started, Developer

# Train & run a custom YOLO model
<!-- ------------------------ -->
## Overview 
Duration: 1

### What You'll Build 
A custom object detection system using the YOLO (You Only Look Once) model architecture. You'll capture images with your camera, annotate them with bounding boxes, train a custom YOLO model, and deploy it to your Viam machine for real-time object detection.
   
<!-- ![YOLO object detection system in action; showing objects detected with bounding boxes and confidence scores](assets/yolo-detection-demo.gif) -->

### Prerequisites
- A computer with a built-in webcam or a USB webcam
- Objects you want to detect (at least 3-5 different objects recommended)
- Basic familiarity with machine learning concepts

### What You'll Need
- Sign up for a free Viam account, and then [sign in](https://app.viam.com)
- Python 3.8+ installed on your computer (for the training script)

### What You'll Learn 
- How to configure a camera in the Viam platform
- How to capture images and create a training dataset
- How to annotate images with bounding boxes
- How to train a custom YOLO model
- How to deploy your trained model to a Viam machine
- How to run real-time object detection with your model

<!-- ------------------------ -->
## Configure your machine
Duration: 5

1. In [the Viam app](https://app.viam.com/fleet/dashboard) under the **LOCATIONS** tab, create a machine by typing in a name and clicking **Add machine**.
   <!-- ![add machine](assets/add-machine.png) -->
2. Click **View setup instructions**.
   <!-- ![setup instructions](assets/setup-instructions.png) -->
3. To install `viam-server` on your device, select the operating system you are running.
4. Follow the instructions that are shown for your platform.
5. The setup page will indicate when the machine is successfully connected.
   <!-- <img src="assets/machine-connected.png" alt="machine connected" width="450"/> -->

Now that your machine is configured, let's add a camera component to start capturing images.

<!-- ------------------------ -->
## Configure your camera
Duration: 5

1. In [the Viam app](https://app.viam.com/fleet/locations), find the **CONFIGURE** tab.
2. Click the **+** icon in the left-hand menu and select **Component**.
3. Select `camera`, and find the `webcam` module. Leave the default name `camera-1` for now, then click **Create**.
   <!-- ![find and add the webcam module for the camera component](assets/add-webcam.png) -->
4. Notice adding this module adds the camera hardware component called `camera-1`. You'll see a collapsible card on the right, where you can configure the camera component.
5. To configure the camera component, the `video_path` of the intended device needs to be set. You can quickly find which devices are connected to your machine by adding a discovery service. Click **Add webcam discovery service** that appears in the prompt.
6. Notice that this adds the `discovery-1` service and `find-webcams` module to your machine in the left sidebar.
7. Click **Save** in the top right to save and apply your configuration changes.
8. Expand the **TEST** panel of the `discovery-1` card. Here, you'll find attributes of all discoverable cameras connected to your machine. Find the `video_path` of the device you'd like to use as your webcam, then copy the value.
   <!-- ![find and copy video_path value](assets/copy-video-path.png) -->
9. Paste the copied `video_path` value into your camera component's `video_path` input, which is in the **Attributes** section.
10. Click **Save** in the top right once more to save and apply your configuration changes.
11. Expand your camera component's **TEST** panel. If things are properly configured, you should see the video streaming from your camera.
    <!-- ![test camera feed](assets/test-camera.png) -->
12. With your camera added and working, you can now delete the `discovery-1` service and `find-webcams` module as you'll no longer need them. Click the *...* next to each item, then select **Delete**. 
13. You will be prompted to confirm the deletion, select **Delete**
14. Finally, **Save** your configuration changes.

Great! Your machine now has a camera component configured and ready to use.

<!-- ------------------------ -->
## Create a dataset and capture training images
Duration: 15

To train a custom YOLO model, you'll need a dataset of images with objects you want to detect. Let's create a dataset and capture some training images using your configured camera.

1. In [the Viam app](https://app.viam.com/data/), find the **DATASETS** tab.
2. Click the **+ Create dataset** button and give your dataset a name, like `yolo-objects`. Click the **Create dataset** button again to save.
   <!-- ![create a dataset](assets/create-dataset.png) -->
3. Switch back to your machine in [the Viam app](https://app.viam.com/fleet/locations). You can navigate back by going to Fleet > All Machines Dashboard, then clicking on the name of your machine.
4. Expand your camera component's **TEST** panel. Here, you'll see the live feed of your camera as well the "Add image to dataset" icon, which looks like a camera.
   <!-- ![add image to dataset button](assets/add-image-button.png) -->
5. Position your object in the camera frame. Make sure the object is clearly visible and well-lit.
   > aside positive
   > **Tips for good training data**: 
   > - Use good lighting to ensure clear, well-lit images
   > - Capture the object from different angles
   > - Include different backgrounds
   > - Vary the distance from the camera
   > - Add variations in object orientation
   > - Aim for at least 30-50 images per object class
   > - Include some images with multiple objects if needed
6. When you are happy with the image, click the **Add image to dataset** button.
7. In the list of datasets that appear, select the dataset you wish to add your captured image to (`yolo-objects`).
   <!-- <img src="assets/select-dataset.png" alt="selecting the dataset" width="450" /> -->
8. Confirm the dataset you've selected, then click **Add**.
   <!-- <img src="assets/add-to-dataset.png" alt="add image to selected dataset" width="450" /> -->
9. A success message will appear at the top-right once your image is added to your selected dataset.
10. Repeat steps 5-9 to capture multiple images of each object you want to detect. For optimal results with YOLO, try to capture at least 30-50 images of each object class from different angles, lighting conditions, and backgrounds.

   <!-- <img src="assets/object1-angle1.jpg" alt="object 1 angle 1" width="200" /> -->
   <!-- <img src="assets/object1-angle2.jpg" alt="object 1 angle 2" width="200" /> -->
   <!-- <img src="assets/object2-angle1.jpg" alt="object 2 angle 1" width="200" /> -->
   <!-- <img src="assets/object2-angle2.jpg" alt="object 2 angle 2" width="200" /> -->

Now that you have your training images, let's annotate them with bounding boxes.

<!-- ------------------------ -->
## Annotate your dataset with bounding boxes
Duration: 20

In this step, you'll annotate your images by drawing bounding boxes around the objects you want to detect and assigning labels to them.

1. In [the Viam app](https://app.viam.com/data/datasets), find the **DATASETS** tab.
2. Click on the name of your dataset (`yolo-objects`).
3. Here, you'll see all of the images you've captured. Select one image from the dataset. A side panel will appear on the right-hand side.
4. Click on the **Annotate** button in this panel.
   <!-- ![dataset side panel when single image selected](assets/select-single-image.png) -->
5. The selected image opens to a larger screen. Create a label for your object, for example `coffee_mug`:
   <!-- ![creating object label](assets/create-label.png) -->
6. With the label chosen, hold the _Command_ or _Windows_ key down while you use your mouse to draw a bounding box around your object. Make sure the box tightly surrounds the object.
   <!-- ![gif of bounding box being drawn around object](assets/draw-bounding-box.gif) -->
7. In the **OBJECTS** panel on the right, you'll see your object listed with an object count of `1`.
   <!-- ![object annotated](assets/object-annotated.png) -->
8. Repeat this process for all images in your dataset. You can quickly navigate between images by pressing the `>` (right arrow) or `<` (left arrow) keys on your keyboard.
9. For images containing multiple objects, create a label and bounding box for each object.
10. When you are finished annotating all images, exit the annotation editor by clicking on the "X" in the top-left corner. A breakdown of your bounding box labels will be displayed:
   <!-- <img src="assets/label-breakdown.png" alt="label breakdown" width="300" /> -->
11. Make sure all your images are labeled and there are no `Unlabeled` images left.

Good job! Your dataset is now ready for training. Next, we'll prepare and run the YOLO training script.

<!-- ------------------------ -->
## Prepare for YOLO model training
Duration: 10

Before we can train our YOLO model, we need to export our dataset and prepare the training environment.

1. In the dataset overview, click on the **Export** button in the left panel.
   <!-- <img src="assets/export-button.png" alt="export button" width="250" /> -->
2. Select **Object Detection (JSONL)** as the export format and click **Export**.
   <!-- <img src="assets/export-options.png" alt="export options" width="400" /> -->
3. The dataset will be downloaded as a JSONL file (JavaScript Object Notation Lines). This file contains all your images with their annotations in a format that our YOLO training script can understand.
4. Create a new directory on your computer for the YOLO training project:
   ```bash
   mkdir yolo-training
   cd yolo-training
   ```
5. Move the downloaded JSONL file to this directory and rename it to `dataset.jsonl`.
6. Create a new file called `train.py` in this directory and copy the YOLO training script from Viam's example. You can use the script from the module you showed earlier (model/training.py) as a reference.
7. Install the required Python packages:
   ```bash
   pip install torch ultralytics scikit-learn pyyaml
   ```

Now you're ready to train your custom YOLO model!

<!-- ------------------------ -->
## Train your YOLO model
Duration: 30

In this step, you'll run the training script to create a custom YOLO model based on your annotated images.

1. In your `yolo-training` directory, create a file called `labels.txt` that contains all the class labels from your dataset, one per line:
   ```
   coffee_mug
   keyboard
   mouse
   ```
2. Run the training script with the following command:
   ```bash
   python train.py --dataset_file dataset.jsonl --model_output_directory model_output --num_epochs 100 --labels 'coffee_mug keyboard mouse' --base_model yolov8s.pt
   ```
   The script parameters are:
   - `--dataset_file`: Path to your JSONL dataset file
   - `--model_output_directory`: Directory where the trained model will be saved
   - `--num_epochs`: Number of training epochs (100 is a good starting point)
   - `--labels`: Space-separated list of your object classes (enclosed in single quotes)
   - `--base_model`: Base YOLO model to start from (yolov8s.pt is a good middle-ground model)

3. The training script will:
   - Parse your dataset
   - Create training and validation splits
   - Set up the YOLO directory structure
   - Train the model for the specified number of epochs
   - Export the model to ONNX format
   - Copy the model and labels to your output directory

4. During training, you'll see progress information and metrics. This may take some time depending on your computer's capabilities. Training on a CPU might take 30 minutes to several hours. If you have a GPU, training will be much faster.
   ```
   Training set size: 120
   Validation set size: 30
   Training YOLOv8 🚀 on dataset.yaml for 100 epochs...
   [...]
   ```

5. Once training is complete, you'll find two important files in your `model_output` directory:
   - `yolov8s.onnx`: Your trained model in ONNX format
   - `labels.txt`: The text file containing your object classes

These files will be used to deploy your model to your Viam machine. Let's do that next!

<!-- ------------------------ -->
## Configure the YOLO-ONNX ML Model
Duration: 10

Now that you have a trained model, let's add it to your Viam machine using the `yolo-onnx` ML model service.

1. In [the Viam app](https://app.viam.com/fleet/locations), find the **CONFIGURE** tab.
2. Click the **+** icon in the left-hand menu and select **Service**.
3. Select `ML Model`, then search for and select the `hipsterbrown:mlmodel:yolo-onnx` module from the registry. Leave the default name `mlmodel-1` for now, then click **Create**.
   <!-- <img src="assets/add-yolo-onnx.png" alt="add yolo-onnx module" width="450" /> -->
4. In the **Attributes** section of the configuration panel, you need to provide the paths to your model and labels files. You have two options:
   
   **Option 1: Upload files to Viam Registry**
   - Click on your account profile and select **Registry**
   - Click on **+ Create model** and upload your ONNX model and labels.txt files
   - After uploading, select the uploaded model in the ML Model configuration

   **Option 2: Upload files directly to your machine**
   - Use SCP, SFTP, or another file transfer method to copy the model files to your machine
   - Set the `model_path` attribute to the full path of your .onnx file on the machine
   - Set the `label_path` attribute to the full path of your labels.txt file
   
   <!-- <img src="assets/configure-yolo-onnx.png" alt="configure yolo-onnx attributes" width="450" /> -->

5. Click **Save** in the top right to save and apply your configuration changes.

Your YOLO-ONNX ML model service is now configured with your custom model. Next, let's set up a vision service to use this model for object detection.

<!-- ------------------------ -->
## Configure the Vision Service
Duration: 5

1. In [the Viam app](https://app.viam.com/fleet/locations), find the **CONFIGURE** tab.
2. Click the **+** icon in the left-hand menu and select **Service**.
3. Select `vision`, and find the `ML Model` module. Give your vision service a descriptive name, such as `yolo-vision`. Click **Create**.
   <!-- <img src="assets/add-vision-service.png" alt="add vision service" width="450" /> -->
4. In the **Configure** panel of your vision service, set the **ML Model** to your ML Model service (`mlmodel-1`).
   <!-- <img src="assets/configure-vision-ml-model.png" alt="set vision service ml model" width="450" /> -->
5. Move the **Minimum confidence threshold** slider to `0.4`. This sets the minimum confidence level for object detections to be considered valid.
6. Find and select your camera component in the **Depends on** section (`camera-1`).
   <!-- <img src="assets/vision-depends-on.png" alt="set dependent camera" width="450" /> -->
7. Click **Save** in the top right to save and apply your configuration changes.

Your vision service is now configured to use your custom YOLO model for object detection!

<!-- ------------------------ -->
## Test Your Custom YOLO Object Detection
Duration: 10

Now it's time to see your custom YOLO model in action!

1. In the **CONFIGURE** tab, expand the **TEST** panel of your vision service.
2. You'll see a live feed from your camera with object detection overlays.
3. Place some of the objects you trained your model on in front of the camera.
4. If your model is working correctly, you should see bounding boxes around the detected objects along with their class labels and confidence scores.
   <!-- <img src="assets/detection-results.png" alt="object detection results" width="550" /> -->
5. Test different objects, angles, and lighting conditions to see how well your model performs.
6. If you're not getting good results, you can try:
   - Adjusting the confidence threshold
   - Adding more training data
   - Training for more epochs
   - Using a different base model (e.g., yolov8m.pt or yolov8l.pt)

Congratulations! You've successfully trained and deployed a custom YOLO object detection model on your Viam machine.

<!-- ------------------------ -->
## Next Steps and Improvements
Duration: 5

Here are some ways you can improve your YOLO object detection system:

1. **Collect more training data**: Adding more diverse images can improve model accuracy.
2. **Data augmentation**: The YOLO training process includes data augmentation, but you can add more images with different conditions.
3. **Adjust model parameters**: Experiment with different base models, epochs, and training settings.
4. **Post-processing**: Implement additional logic to filter or process the detection results.
5. **Integration with other components**: Connect your object detection system with other components or services in your Viam machine.

Some practical project ideas using your YOLO object detection system:

- **Smart inventory system**: Track objects as they're added or removed from a space
- **Sorting machine**: Identify and sort different types of objects
- **Security monitor**: Detect specific objects or people
- **Robotics vision**: Give your robot the ability to identify and interact with objects

<!-- ------------------------ -->
## Conclusion and Resources
Duration: 1

Congratulations! You've successfully built a custom object detection system using YOLO and Viam. 🎉 You've learned how to:

- Configure a camera in the Viam platform
- Capture images and create a dataset
- Annotate images with bounding boxes
- Train a custom YOLO model
- Deploy your model to a Viam machine
- Set up a vision service for real-time object detection

The YOLO architecture is one of the most efficient and accurate object detection systems available, making it perfect for real-time applications. By combining it with Viam's platform, you can easily deploy sophisticated computer vision capabilities to your machines.

### Related Resources
- [Viam Documentation](https://docs.viam.com/)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [ML Model Service Documentation](https://docs.viam.com/registry/ml/yolo-onnx/)
- [Vision Service Documentation](https://docs.viam.com/services/vision/)
- [Viam Community Discord](https://discord.gg/viam)
