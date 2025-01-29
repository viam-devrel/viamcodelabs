author: CodersCafe
id: pomodoro-bot
summary: Build Your Own Pomodoro Bot With Viam And Raspberry Pi
categories: Getting-Started, Developer
environments: web
status: Published 
feedback link: https://github.com/viam-labs/viamcodelabs/issues
tags: Getting Started, Developer, Data, Robotics, Environmental Monitoring, Sensors, Pomodoro

# Build Your Own Pomodoro Bot With Viam

<!-- ------------------------ -->

## Introduction

Duration: 5


In today’s fast-paced world, staying productive while maintaining focus can be challenging. Meet the **Pomodoro Bot**, your desktop companion designed to revolutionize the way you work. Built using Viam's versatile robotics platform and powered by the Raspberry Pi, this innovative tool goes beyond the traditional Pomodoro timer by integrating modern sensors and smart alerts to create a seamless productivity experience.

Features include:

- Pomodoro Timer: Master the Pomodoro Technique to enhance your focus and efficiency.
- Air Quality Monitoring: Ensure your workspace is optimal for productivity by tracking CO₂, VOC levels and AQI.
- Light Quality Alerts: Optimize lighting conditions for reduced eye strain and better concentration.
- Meeting Reminders: Stay on top of your schedule with proactive alerts for upcoming meetings.

With a sleek design and a focus on intelligent functionality, the Pomodoro Bot is more than just a timer; it’s your dedicated partner in productivity. Whether you're working from home or at the office, this bot ensures you stay productive, healthy, and on schedule.

![finished product](assets/pomodoroBot.jpg)

### Prerequisites

- Sign up for a free Viam account, and then [sign in](https://app.viam.com/fleet/locations/) to the Viam app
- Hardware and Supplies
  - 1 - [Raspberry Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/)
  - 1 - microSD card to use with your Pi
  - 1 - [Raspberry Pi Official Power Supply](https://www.raspberrypi.com/products/27w-power-supply/)
  - 1 - [4inch HDMI Capacitive Touch IPS LCD Display](https://www.waveshare.com/4inch-hdmi-lcd-c.htm)
  - 1 - [Fermion: ENS160 Air Quality Sensor](https://www.dfrobot.com/product-2523.html)
  - 1 - [TEMT6000: An Ambient Light Sensor](https://robu.in/product/cjmcu-temt6000-an-ambient-light-sensor/)
  - 1 - [Push Button Module](https://robu.in/product/blue-electronic-building-blocks-big-key-button-module-high-level-output/)
  - 1 - [USB Type C Breakout Board - Female](https://robu.in/product/usb-type-c-breakout-board-downstream-connection/)
  - 1 - [USB Type C Breakout Board - Male](https://evelta.com/usb-type-c-male-plug-connector-with-pcb-usb-c-breakout/)
  - 1 - Silicone Wire
- Software Requirements
  - [VS Code](https://code.visualstudio.com/download) installed, or your preferred code editor
  - [Python3](https://www.python.org/downloads/) installed

### Watch The Video

Let's start by seeing our **Pomodoro Bot** in action!

<video id="oqOOdluptVU"></video>

<!-- ------------------------ -->


<!-- ------------------------ -->
## Set Up Your Raspberry Pi

Duration: 5

The Raspberry Pi boots from a USB flash drive (or microSD card). You need to install Raspberry Pi OS on a USB flash drive that you will use with your Pi. For more details about alternative methods of setting up your Raspberry Pi, refer to the [Viam docs](https://docs.viam.com/installation/prepare/rpi-setup/#install-raspberry-pi-os).

### Install Raspberry Pi OS

1. Connect the USB flash drive (or microSD card) to your computer.
1. Download the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) and launch it.
   ![raspberry pi imager](assets/imager.png)
1. Click **CHOOSE DEVICE**. Select your model of Pi, which is Raspberry Pi 5.
1. Click **CHOOSE OS**. Select **Raspberry Pi OS (64-bit)** from the menu.
1. Click **CHOOSE STORAGE**. From the list of devices, select the USB flash drive you intend to use in your Raspberry Pi.
   ![raspberry pi storage](assets/osSelect.png)
1. Configure your Raspberry Pi for remote access. Click **Next**. When prompted to apply OS customization settings, select **EDIT SETTINGS**.
1. Check **Set hostname** and enter the name you would like to access the Pi by in that field, for example, `raspberrypi`.
1. Select the checkbox for **Set username and password** and set a username (for example, your first name) that you will use to log into the Pi. If you skip this step, the default username will be `pi` (not recommended for security reasons). And specify a password.
1. Connect your Pi to Wi-Fi so that you can run `viam-server` wirelessly. Check **Configure wireless LAN** and enter your wireless network credentials. SSID (short for Service Set Identifier) is your Wi-Fi network name, and password is the network password. Change the section `Wireless LAN country` to where your router is currently being operated.
   ![raspberry pi hostname username and password](assets/setupSettings.png)
1. Select the **SERVICES** tab, check **Enable SSH**, and select **Use password authentication**.
   ![raspberry pi enable SSH](assets/sshSettings.png)
   > aside negative
   > Be sure that you remember the `hostname` and `username` you set, as you will need this when you SSH into your Pi.
1. **Save** your updates, and confirm `YES` to apply OS customization settings. Confirm `YES` to erase data on the USB flash drive. You may also be prompted by your operating system to enter an administrator password. After granting permissions to the Imager, it will begin writing and then verifying the Linux installation to the USB flash drive.
1. Remove the USB flash drive from your computer when the installation is complete.

### Connect with SSH

1. Place the USB flash drive into your Raspberry Pi and boot the Pi by plugging it in to an outlet. A red LED will turn on to indicate that the Pi is connected to power.
   > aside negative
   > Make sure you are using a 5V 5A (25W) power supply. USB boot is disabled by default [when connected to a 3A power supply](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#differences-on-raspberry-pi-5), so adequate amperage is required for the optimal performance of your Raspberry Pi 5.
1. Once the Pi is started, connect to it with SSH. From a command line terminal window, enter the following command. The text in <> should be replaced (including the < and > symbols themselves) with the user and hostname you configured when you set up your Pi.
   ```bash
   ssh <USERNAME>@<HOSTNAME>.local
   ```
1. If you are prompted “Are you sure you want to continue connecting?”, type “yes” and hit enter. Then, enter the password for your username. You should be greeted by a login message and a command prompt.
   ![raspberry pi SSH login](assets/sshLogin.png)
1. Update your Raspberry Pi to ensure all the latest packages are installed
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

### Enable communication protocols

1. Launch the Pi configuration tool by running the following command
   ```bash
   sudo raspi-config
   ```
1. Use your keyboard to select “Interface Options”, and press return.
   ![raspi config](assets/interfaceOptions.png)
1. [Enable the relevant protocols](https://docs.viam.com/installation/prepare/rpi-setup/#enable-communication-protocols) to support our hardware. Since you are using a sensor that communicates over the I2C, enable **I2C**.
   ![enable serial](assets/enableI2C.png)
1. Confirm the options to enable I2C interface. And reboot the Pi when you're finished.


<!-- ------------------------ -->
## Configure Your Machine

Duration: 5

### Create Your Machine

1. In [the Viam app](https://app.viam.com/fleet/locations) under the **LOCATIONS** tab, create a machine by typing in a name and clicking **Add machine**.
   ![add machine](assets/addMachine.png)
<br>
1. Click **View setup instructions**.
   ![setup instructions](assets/awaitSetup.png)
1. Install `viam-server` on the Raspberry Pi device that you want to use to communicate with and control your Pomodoro Bot. Select the `Linux / Aarch64` platform for the Raspberry Pi, and leave your installation method as [`viam-agent`](https://docs.viam.com/how-tos/provision-setup/#install-viam-agent).
   ![select platform](assets/selectPlatform.png)
1. Use the `viam-agent` to download and install `viam-server` on your Raspberry Pi. Follow the instructions to run the command provided in the setup instructions from the SSH prompt of your Raspberry Pi.
   ![installation agent](assets/installAgent.png)
   The setup page will indicate when the machine is successfully connected.

### Add your Raspberry Pi

1. In [the Viam app](https://app.viam.com/fleet/locations), find the **CONFIGURE** tab. It's time to configure your hardware.
1. Click the **+** icon in the left-hand menu and select **Component**.
   ![select component](assets/selectComponent.png)
1. Select `board`, and find the `pi5` module. This adds the module for working with the Raspberry Pi 5's GPIO pins.
![select board](assets/selectBoard.png)
1. Notice adding this module adds the board hardware component called `PI5`. The collapsible card on the right corresponds to the part listed in the left sidebar.
   ![added board](assets/addedBoard.png)
1. Click **Save** in the top right to save and apply your configuration changes.
   > aside negative
   > If any problems occur, check under the **LOGS** tab to see what might be going wrong.

<!-- ------------------------ -->
## Integrate Google Calendar

Duration: 5

Now let's set up your Pomodoro Bot to work with Google Calendar, so you can stay on top of your schedule without losing focus. Once integrated, your bot will automatically sync with your calendar to manage events and reminders.

### Set Up a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project specifically for this integration.
   ![new project](assets/googleCloud.png)
3. Once the project is ready:
    - Open the [API Library](https://cloud.google.com/apis/docs/overview).
    - Search for "Google Calendar API".
      ![calendar API](assets/calendarAPI.png)
    - Click "Enable" to activate the API.
      ![enable API](assets/enableAPI.png)
   

### Create a Service Account

1. In the Google Cloud Console, navigate to **IAM & Admin** > **Service Accounts**.
![IAM & Admin](assets/IAM.png)

2. Set up a new service account:
    * Create a new service account
      ![Create Service Account](assets/createServiceAccount.png)
      ![Name Service Account](assets/nameServiceAccount.png)
    * Assign the role "Editor" or "Owner" to give it the necessary permissions.
      ![Assign Roles](assets/assignRoles.png)
    * Create and download the key file in JSON format. This file will be essential later.
      ![Manage Keys](assets/manageKeys.png)
      ![Create Key](assets/createKey.png)
      ![Download Key](assets/downloadKey.png)
    * Keep the file in a secure location.
    * To transfer this file from your PC to Raspberry Pi, you can use SCP command in the following format
      <br><br>
      Using hostname
      ```bash 
         #Format: scp service-account-file.json username@hostname.local:/path/on/raspberrypi
         scp pomodorobot-service-account-file.json pi@raspberrypi.local:/home/pi/
      ```
      Using IP Address
      ```bash
         #Format: scp service-account-file-name.json username@ip-address-of-raspberrypi:/path/on/raspberrypi
         scp pomodorobot-service-account-file.json pi@192.168.1.4:/home/pi/
      ```

### Share Your Calendar with the Service Account

1. Open Google Calendar.
   ![Google Calendar](assets/googleCalendar.png)
2. Select the calendar you want to use.
   ![Select Calendar](assets/selectCalendar.png)
3. In **Settings and Sharing**, find the "Share with specific people" section:
   ![Share With Specific People](assets/shareSettings.png)
    * Enter the email address from the service account key file.
    * Give it permission to "Make changes to events."
      ![Share Access](assets/shareAccess.png)
    * Scroll down to "Integrate Calendar" and copy the **Calendar ID** for the next steps.
      ![Calendar ID](assets/calendarID.png)

### Connect Your Calendar to the Pomodoro Bot

1. Open the Viam app and go to the **CONFIGURE** tab.
2. Add the **Calendar module**, and provide:
   ![Google Calendar Service](assets/addGoogleCalendar.png)
    * The **Calendar ID** you copied earlier.
    * The path to the service account JSON file.
      ![Calendar Configuration](assets/calendarConfig.png)
3. Save your changes to complete the setup.

### Test the Integration

1. Create a test event in Google Calendar:
    * Name it something like "Test Meeting" and save the event.
      ![Test Meeting](assets/testMeeting.png)
2. Go back to the Viam app and open the **Control** tab.
      ![Control Tab](assets/controlTab.png)
3. Use the given command in the **DO COMMAND** interface to check for upcoming calendar events.
      ```json
         {
            "get_events": {
               "max_results": 10
            }
         }
      ```
      ![Test Calendar](assets/testCalendar.png)

If everything is working correctly, you should see your test event ("Test Meeting") listed in the results. This confirms that your Pomodoro Bot is successfully linked to your Google Calendar.
<!-- ------------------------ -->
## Integrate ENS160 Air Quality Sensor

Duration: 10

Let's integrate the ENS160 air quality sensor with your Pomodoro Bot to monitor indoor air quality effectively. The ENS160 sensor tracks VOCs (volatile organic compounds), eCO2 (equivalent carbon dioxide), and provides an Air Quality Index (AQI) – vital for maintaining an optimal workspace environment.

![ENS160](assets/ens160.jpg)

### Hardware Setup

* **Power Connections:**
    * Connect the `VCC` pin of the ENS160 sensor to the [`3.3 Volts`](https://pinout.xyz/pinout/3v3_power) pin on the Raspberry Pi.
    * Connect the `Ground` pin of the ENS160 sensor to a [`Ground`](https://pinout.xyz/pinout/ground) pin on the Raspberry Pi.

* **I2C Communication:**
    * Wire the `SCL` pin of the ENS160 sensor to the [`SCL`](https://pinout.xyz/pinout/pin5_gpio3/) pin on the Raspberry Pi.
    * Wire the `SDA` pin of the ENS160 sensor to the [`SDA`](https://pinout.xyz/pinout/pin3_gpio2/) pin on the Raspberry Pi.

![ENS160 Connection Diagram](assets/ens160Circuit.svg)

Ensure all connections are secure and double-check your wiring to avoid any issues.

### Software Integration

* **Add the ENS160 Sensor to the Viam App:**
    1. Open the Viam app.
    2. Navigate to the **CONFIGURE** tab.
    3. Add a new component for the ENS160 sensor.
    ![Add ENS160](assets/addENS160.png)
    4. Click "Save" and wait for the component to finish setup.

* **Testing the Integration:**
    1. Switch to the **Control** tab in the Viam app.
    2. Observe the live data feed from the ENS160 sensor, including real-time air quality metrics such as VOC levels, eCO2 values, and AQI.
      ![Test ENS160](assets/testENS160.png)

<!-- ------------------------ -->
## Integrate TEMT6000 Ambient Light Sensor

Duration: 10

Enhance your Pomodoro Bot by integrating the TEMT6000 ambient light sensor, which monitors light levels to help optimize workspace lighting for improved productivity. With this sensor, your bot can detect ambient light intensity and make adjustments as necessary to create a comfortable and efficient working environment.

### Hardware Setup

* **Components:**
    * TEMT6000 Ambient Light Sensor
      ![TEMT 6000](assets/temt6000.jpg)
    * ADS1115 Analog-to-Digital Converter (ADC)
      ![ADS1115 ADC](assets/ads1115.jpg)

* **Connections:**
    * **TEMT6000 to ADS1115:**
        * Connect the `S` or `SIG` Pin(analog output pin) of the TEMT6000 to one of the analog input channels (e.g., A0) on the ADS1115.
        * Connect the `VCC` pin of the TEMT6000 to the `3.3V` pin on the Raspberry Pi.
        * Connect the `Ground` pin of the TEMT6000 to the `Ground` pin on the ADS1115.

    * **ADS1115 to Raspberry Pi:**
        * Connect the `SCL` pin of the ADS1115 to the [`SCL`](https://pinout.xyz/pinout/pin5_gpio3/) pin on the Raspberry Pi.
        * Connect the `SDA` pin of the ADS1115 to the [`SDA`](https://pinout.xyz/pinout/pin3_gpio2/) pin on the Raspberry Pi.
        * Connect the `VCC` pin of the ADS1115 to the [`3.3 Volts`](https://pinout.xyz/pinout/3v3_power) pin on the Raspberry Pi.
        * Connect the `Ground` pin of the ADS1115 to a [`Ground`](https://pinout.xyz/pinout/ground) pin on the Raspberry Pi.
    ![TEMT6000 Connection Diagram](assets/temt6000Circuit.jpg)

### Software Integration

* **Add the TEMT6000 Sensor in Viam App:**
    1. Open the Viam application.
    2. Navigate to the **CONFIGURE** tab.
    3. Add the TEMT6000 sensor as a new component, specifying its ADC channel.
    ![addTEMT6000](assets/addTEMT6000.png)
    ![TEMT6000 Configuration](assets/temt6000Config.png)
    4. Click "Save" and wait for the component to finish setup.

* **Testing the Sensor:**
    1. Switch to the **Control** tab in the Viam app.
    2. Observe the live data feed from the TEMT6000 sensor.
       ![TEMT6000 Test](assets/testTEMT6000.png)
    3. Adjust the lighting around the sensor and verify that the readings update in real time.


##  Integrate a 4-Inch HDMI Capacitive Touch Display

Duration: 10

Adding a display to your Pomodoro Bot elevates it from a functional productivity tool to an interactive and engaging companion. With a screen, your bot can visually communicate, provide intuitive feedback, and motivate you with friendly reminders or fun animations. 

![Display](assets/display.jpg)

**Features**

* 4-inch IPS screen, hardware resolution is 720 × 720.
* 5-point capacitive touch, toughened glass panel, hardness up to 6H.
* When used with Raspberry Pi, it supports Raspberry Pi OS / Ubuntu / Kali and Retropie.
* Ubuntu is supported when used with Jetson Nano.
* When used as a computer monitor, it supports Windows 11/10/8.1/8/7.
* Onboard dual touch circuit, optional USB Type-C or I2C touch, it has more application scenarios.
* With 3.5mm audio and speaker interface, it supports HDMI audio output.

### Hardware Connection

1. Set the touch switch on the back of the screen to "I2C".
2. Fix the Raspberry Pi to the screen through the copper posts, and pay attention to aligning the position of the ejector pins.
3. Connect the HDMI port of the Raspberry Pi to the LCD.
4. Connect USB-C on Display to USB port on Raspberry Pi to enable touch interactions.

![LCD Connected To RPI 5](assets/lcdConnect.jpg)

### Software Setup

1. Follow the instructions to **Setup Raspberry Pi** using Pi Imager.
2. After the setup is completed, insert the SD card into your computer and open the config.txt file in the root directory of the SD card, and add the following code at the end of the file:

```bash
dtparam=i2c_arm=on
dtoverlay=waveshare-4dpic-3b
dtoverlay=waveshare-4dpic-4b
dtoverlay=waveshare-4dpic-5b
hdmi_force_hotplug=1
config_hdmi_boost=10
hdmi_group=2
hdmi_mode=87
hdmi_timings=720 0 100 20 100 720 0 20 8 20 0 0 0 60 0 48000000 6
start_x=0
gpu_mem=128
```

3. Download the [4inch HDMI LCD (C) DTBO file](https://files.waveshare.com/wiki/4inch%20HDMI%20LCD%20(C)/4HDMIB_DTBO.zip) and extract the 3 dtbo files. Copy these 3 files to the overlays directory (`/boot/overlays/`).
4. Save the changes to the config.txt file, eject the SD card safely, and insert it into the Raspberry Pi.
5. Power on the Raspberry Pi and wait for more than ten seconds to display normally

<!-- ------------------------ -->

## Integrate Button To Pomodoro Bot

To enhance the functionality of your Pomodoro Bot, you can integrate a push button to allow manual control, such as starting or stopping tasks, resetting timers, or triggering specific actions. Here's how to add a push button:

### Hardware Setup

**Components Needed:**
* Push button module
![Push Button Module](assets/pushbutton.jpg)
* Jumper wires

**Wiring:**
* Connect `VCC` pin of the push button to a [`5V`](https://pinout.xyz/pinout/5v_power) pin on the Raspberry Pi.
* Connect `GND` pin of the push button to a [`Ground`](https://pinout.xyz/pinout/ground) pin on the Raspberry Pi.
* Connect `OUT` pin of the push button to a [`GPIO 17`](https://pinout.xyz/pinout/pin11_gpio17/) on the Raspberry Pi.

By adding a push button, you can make your Pomodoro Bot more interactive and user-friendly! 

<!-- ------------------------ -->
## 3D Design and Fabrication

Duration: 10

### Aesthetics and Personality

We envisioned the Pomodoro Bot as more than just a functional tool. It needed to be visually appealing and possess a unique personality. To achieve this we used Fusion 360, to craft a 3D model, carefully balancing aesthetics and practicality. This process involved refining every detail to ensure the bot was both charming and functional.

![3D Design](assets/3dDesign.png)

The final result is a compact and modern 3D-printed bot that is not only a productivity powerhouse but also a delightful desk companion designed to bring a smile to your face while helping you stay focused.

### 3D Printing Process

After finalizing the design, we brought our concept to life through 3D printing. We utilized the Bambu A1 3D printer to:

* Create the bot's physical form with precision and efficiency.
* Achieve a durable and well-crafted model that perfectly matched our design vision. 

![3D Printing](assets/3dPrinting.jpg)

![3D Printed Parts](assets/3dParts1.jpg)

![3D Printed Parts](assets/3dParts2.jpg)

This 3D printing step was crucial in transforming the digital design into a tangible, high-quality physical product.

Find the STL Files [here](https://github.com/CodersCafeTech/PomodoroBot/tree/main/3D).

## Assembly

Duration: 10

* **Soldering:** We began by soldering wires to all necessary components, ensuring reliable electrical connections.
   ![Soldering](assets/soldering.jpg)
* **Component Mounting:** We secured the components together using tiny screws, creating a firm and stable assembly. 
   ![Components](assets/mounting.jpg)
* **Raspberry Pi and Display Integration:** The Raspberry Pi and Waveshare display were carefully installed into the main body of the project.
   ![RPI Integration](assets/rpiInstallation.jpg)
* **Modular Connections:** Female headers were utilized to solder connections between the components and the Raspberry Pi, facilitating modularity and ease of maintenance.
* **Power Delivery:** Male and female USB breakout boards were employed to efficiently power the Raspberry Pi.
   ![Power](assets/powerUSB.jpg)

* **Final Assembly:** The back cover was positioned and secured, completing the assembly process.
   ![Back Cover](assets/backCover.jpg)   

* **Result:** The final result is a sleek and functional Pomodoro Bot ready to enhance productivity and brighten any workspace.
   ![Assembled Product](assets/finalProduct.jpg)  

## Giving Life To Our Pomodoro Bot

Duration: 5

### 1. Power Up the Raspberry Pi

Once the assembly process is complete, power up your Raspberry Pi. You can do this by connecting the power supply to the Raspberry Pi's power jack.

### 2. Verify Functionality

After powering up, take a moment to verify that everything is functioning as expected. This may involve checking the Raspberry Pi's LED indicators and ensuring the Waveshare display turns on.

### 3. Download Source Code

The next step is to download the source code for the Pomodoro Bot application on to your Raspberry Pi. You can download the code from the following GitHub repository:

* [https://github.com/CodersCafeTech/PomodoroBot](https://github.com/CodersCafeTech/PomodoroBot)

### 4. Edit the Source Code (main.py)

- Open the downloaded source code and navigate to the `Code` directory. Locate the file named `main.py`.
- Within `main.py`, you will need to replace the following placeholders with your own values:
    * **API Key:** Locate the section where the API key is stored and replace it with your own API key. 
    * **API Key ID:** Similarly, find the section where the API Key ID is stored and replace it with your unique ID.
    * **Component Names (Optional):** If you have used different component names during configuration, you may need to modify the corresponding names within the code.

### 5. Run the Pomodoro Bot Code

- Once you've made the necessary edits to `main.py`, save the changes.
- Back in the **Configure** tab in the Viam app, add a new **Process**.
  ![Add Process](assets/addProcess.png)
- Configure the Process by adding relevant details like Executable, Arguments and Working Directory.
   * **Executable**: python3
   * **Arguments**: main.py (Python script name)
   * **Working Directory**: /home/pi/PomodoroBot/Code (Your working directory)

  ![Configure Process](assets/configureProcess.png)
- **Save** and wait for the process to finish setup.
 

### 6. See Your Pomodoro Bot Alive!

If everything is configured correctly, the Pomodoro Bot application should launch and your Raspberry Pi will transform into a functional Pomodoro Bot, ready to help you manage your work sessions and boost your productivity.

![Assembled Product](assets/FinalProduct.gif) 