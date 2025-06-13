author: Joyce
id: claw-game
summary: Create your own arcade claw game using a robotic arm, an arcade claw grabber, and Nvidia Jetson
categories: Getting-Started, Developer
environments: web
status: Published
feedback link: https://github.com/viam-devrel/viamcodelabs/issues
tags: Getting Started, Developer

# Build a Robotic Claw Game with a Jetson

<!-- ------------------------ -->

## Overview

Duration: 1

In this tutorial, you'll create an arcade claw game using a robotic arm, an arcade claw grabber, and a Jetson. Learn how to fine-tune the machine, from the precision of each grab, to the claw’s strength, and even the aesthetics of your control interface.

### Prerequisites

- Sign up for a free Viam account, and then [sign in](https://app.viam.com/fleet/locations/) to the Viam app
- Hardware and supplies requirements

  - 1 - [Nvidia Jetson Orin Nano](https://developer.nvidia.com/buy-jetson) with [Jetpack 5](https://www.jetson-ai-lab.com/initial_setup_jon.html), set up so you can SSH into it, with a microSD card, and power supply
  - 1 - [uFactory xarm 6](https://www.ufactory.us/product/ufactory-xarm-6) robotic arm assembled and mounted securely on a surface. This requires a wired ethernet connection to communicate with the control box over the local network.
  - 1 - [An arcade claw](https://a.co/d/0zdeCQ2)
  - 1 - [24V power supply w/ barrel jack to screw terminal adapter](https://a.co/d/02IrvaE)
  - 1 - 3D printer to print the claw mount
  - 2 - [M4 12mm hex screws](https://a.co/d/4Aw6LVh) for mounting the claw
  - 1 - Hex 4 screwdriver
  - 3 - M3 button socket cap screws w/ matching nuts
  - 600 - Small items for the claw to grab

### What You’ll Learn

- How to use modules from [the Viam registry](https://docs.viam.com/registry/)
- How to use the motion service through the Viam TypeScript SDK
- How to create a custom control interface using the Viam TypeScript SDK

### What You’ll Build

- An arcade claw game that lets players control a robot arm to pick up items

### Watch the Video

See a demonstration and overview of the arcade claw game in this video.

<!-- <video id="WFlZlPSefqc"></video> -->

<!-- ------------------------ -->

## Assemble your components

Duration: 15

### Set up the claw

1. **3D print the claw mount**: [Download the STL](https://github.com/viam-labs/claw-game/blob/main/xarm6ClawMount.stl) for the claw mount, and use a 3D printer to print the mount for in between the claw and the xArm6.
   ![claw mount 1](assets/claw-mount_hue.webp)
1. **Attach the claw to the printed mount**:
   - With a screwdriver, remove the metal top cap from the claw by removing the side screws.
   - Remove the string that came with the claw, it is not needed.
   - Extend 2 or 3 M3 button socket cap screws through the recessed inner holes of the printed mount and through the slots on the top of the claw cap.
   - Secure the M3 screws with nuts and tighten.
   - Attach the printed mount and claw end cap to the claw, add the previously removed screws and tighten.
1. **Mount the claw to the arm**: Using two M20 screws, attach the printed mount to the end of the arm and tighten.
   ![claw mount 2](assets/mount-screw-holes_hu.webp)
   ![claw mount 3](assets/mount-gripper_hu.webp)
1. Using hook-and-loop cable ties, run the claw’s cable along each segment of the arm to the arm base, making sure the cord is secure but with some slack to allow for movement.
   ![claw mount 3](assets/mount-together_hu.webp)

### Wire and test the claw

The arcade claw is actuated when a solenoid is powered, acting as a magnet to pull the claw shut. For this project, we use a relay, which allows us to programmatically control when power flows to the claw’s solenoid.

1. Using a barrel jack adapter, connect the positive (red) wire from the claw to the positive terminal of the adapter.
1. Then, connect the negative (black) wire from the claw to the `COM` terminal on the relay.
1. Cut a length of wire and connect it between the `NO` terminal on the relay and the negative terminal on the barrel jack adapter. This creates a normally open circuit, which means the circuit is normally not complete and the claw is therefore normally not powered.

In order to control the claw through Viam, you will now wire the relay to the Jetson.

![wiring diagram](assets/wiringJetson.png)

<!-- ------------------------ -->

## Configure your machine

Duration: 5

1. In [the Viam app](https://app.viam.com/fleet/dashboard) under the **LOCATIONS** tab, create a machine by typing in a name like "claw-game" and clicking **Add machine**.
   ![create new machine in Viam app](assets/create-machine.png)
1. Click **View setup instructions**.
   ![new, unprovisioned machine in Viam app](assets/new-machine.png)
1. To install `viam-server` on the Jetson device that you want to use, select the `Linux / Aarch64` platform for the Jetson, and leave your installation method as [`viam-agent`](https://docs.viam.com/how-tos/provision-setup/#install-viam-agent).
   ![machine setup instructions in Viam app](assets/setup-viam.png)
1. Use the `viam-agent` to download and install `viam-server` on your Jetson. SSH into your Jetson device, then follow the instructions to run the command provided in the setup instructions:
   ![installing viam-server on the Jetson via SSH](assets/install-viam-jetson.png)
1. The setup page will indicate when the machine is successfully connected.
   ![machine connected successfully](assets/machine-connected.png)

<!-- ------------------------ -->

## Configure your components

Duration: 15

### Add your Jetson board
1. In [the Viam app](https://app.viam.com/fleet/locations) under the **CONFIGURE** tab, click the **+** icon in the left-hand menu and select **Component or service**.
   <br>
   <img alt="select component or service" src="assets/add-component.png" width=350 />
1. Select `board`, and find the `nvidia:jetson` module. This adds the module for working with a Jetson device. Click **Add module**.
   <br>
   <img alt="find jetson module" src="assets/find-jetson-module.png" width=350 />
1. Give your component a more descriptive name, like `jetson-board`. Click **Create**.
   <br>
   <img alt="add jetson module" src="assets/name-jetson-board.png" width=350 />
1. Notice this adds the board hardware component called `jetson-board`. 
   <br>
   <img alt="board component added" src="assets/board-card.png" />
1. Click **Save** in the top right. This may take a moment to apply your configuration changes.

### Configure your arm
1. In [the Viam app](https://app.viam.com/fleet/locations) under the **CONFIGURE** tab, click the **+** icon in the left-hand menu and select **Component or service**.
1. Select `arm`, and find the `ufactory:xArm6` module. This adds the module for working with a uFactory xArm6 arm. Click **Add module**.
   <br>
   <img alt="find arm module" src="assets/find-arm.png" width=350 />
1. Leave the default name `arm-1` for now. Click **Create**.
1. Notice this adds the arm hardware component called `arm-1`. 
   <br>
   <img alt="arm component added" src="assets/arm-card.png" />
1. In the JSON configuration section of your arm component, add the `host`, `speed_degs_per_sec`, and `acceleration_degs_per_sec_per_sec` attributes (with your preferred values). `host` refers to your arm's IP address (which you can find [here](https://docs.ufactory.cc/user_manual/ufactoryStudio/3.connection.html#_3-2-software-connection)), `speed_degs_per_sec` refers to the rotational speed of the joints (between 3 and 180, default is 50 degrees/second), and `acceleration_degs_per_sec_per_sec` refers to the acceleration of joints in radians per second increase per second (default is 100 degrees/second ^2):
   ```json
      {
         "host": "10.1.1.26",
         "speed_degs_per_sec": 20,
         "acceleration_degs_per_sec_per_sec": 0
      }
   ```
1. Scroll down a bit to find the **Frame** section, which is still within the **Configure** area. Click **Add frame**.
   <br>
   <img alt="add frame to arm" src="assets/add-frame.png" width=450 />
1. This adds a default frame with initial default values. Leave these default values for now.
   ![default frame added to arm](assets/default-frame-added.png)
1. Click **Save** in the top right. This may take a moment to apply your configuration changes.


### Configure your gripper
1. In [the Viam app](https://app.viam.com/fleet/locations) under the **CONFIGURE** tab, click the **+** icon in the left-hand menu and select **Component or service**.
1. Select `gripper`, and find the `viam_gripper_gpio:gripper` module. This adds the module for working with a gripper via GPIO pins. Click **Add module**.
   <br>
   <img alt="find gripper module" src="assets/find-gripper.png" width=350 />
1. Leave the default name `gripper-1` for now. Click **Create**.
1. Notice this adds the gripper component called `gripper-1`. 
   <br>
   <img alt="gripper component added" src="assets/gripper-card.png" />
1. In the JSON configuration section of your arm component, add the following attributes:
   ```json
      {
         "board": "jetson-board",
         "pin": "7"
      }  
   ```
1. Click **Save** in the top right. This may take a moment to apply your configuration changes.


<!-- ------------------------ -->

## Test your components

Duration: 5

### Testing the board component
1. In your board component, expand the TEST section. Here, you'll find a testing panel where you can test individual GPIO pins by reading from or writing to them.
2. Set the **Pin** field to `7`, the **Pin type** to `GPIO`, and the **Mode** to `Write`.
3. Assuming the gripper is in the default open state, test closing it by setting the **State** to `High`, then pressing **Set**. To test opening it, set the **State** to `Low`, then press **Set**:
   ![GIF of testing board component with gripper](assets/test-board-claw-game.gif)

### Testing the arm component
1. In your arm component, expand the TEST section. Here, you'll find a testing panel where you can test various arm and joint actions.
3. To test the movement of specific joints,  you can use the `MoveToJointPositions` panel. For example, to move joint 0 (the lowest on the arm), change the angle for joint 0's input, the press **Execute**. To test the top-most joint (in our case, where the gripper is mounted), change the angle for joint 5, then press **Execute**:
   ![GIF of testing arm joint movement](assets/test-move-joint-positions.gif)
1.  Try also testing the movement to specific positions using the `MoveToPosition` panel. For example, to move the arm down, change the `Z` input to a smaller number. To move it back up, change the `Z` to a higher number. To test the rotation of the wrist, try changing the `θ`'s input:
   ![GIF of testing arm movement to specific positions](assets/test-move-to-positions.gif)

### Testing the gripper component
1. In your gripper component, expand the TEST section. Here, you'll find a testing panel where you can test opening and closing the gripper.
3. Assuming the gripper is in the default open state, test the Grab action by selecting the **Grab** button. To test the open action, select the **Open** button:
   ![GIF of testing board component with gripper](assets/test-gripper.gif)

<!-- ------------------------ -->

## Use the Viam motion service

Duration: 15

### Create obstacles and a world state

<!-- ------------------------ -->

## Create a custom interface using TypeScript

Duration: 15

### Create

<!-- ------------------------ -->

## Finishing touches

Duration: 15

### Enclosure

![enclosure under construction](assets/enclosure.jpeg)

<!-- ------------------------ -->

## Next Steps

Duration: 2

### Find the red ball
