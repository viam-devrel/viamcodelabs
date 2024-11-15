author: HipsterBrown
id: monitoring-automation-elastic
summary: Monitoring and automate the physical world using sensor data from machines with Elasticsearch and Kibana
categories: Getting-Started, Developer
environments: web
status: Published 
feedback link: https://github.com/viam-labs/viamcodelabs/issues
tags: Getting Started, Developer, Data

# Use Sensor Data with Elastic, Kibana, and Webhooks
<!-- ------------------------ -->
## Overview 
Duration: 1

Gathering sensor data starts out simple but over time it can be overwhelming to sift through all that information, especially as more and more sensors come online. If you've worked on a comprehensive web service in the past, you might already know about [Elasticsearch](https://www.elastic.co/elasticsearch) and the rest of the [ELK stack](https://www.elastic.co/elastic-stack) for indexing and analyzing data from any source, including sensors connected to Viam machines!
One neat feature of the ELK stack is configurable [alerting rules](https://www.elastic.co/guide/en/kibana/current/alerting-getting-started.html) and [actions](https://www.elastic.co/guide/en/kibana/current/alerting-getting-started.html#alerting-concepts-actions) that can be used to automate notifications or even affect the physical world using one of Viam's SDKs.

In this codelab, you'll learn how to continually index sensor data from Viam into Elasticsearch and display an alert in the real world. 

### Prerequisites
- A computer with MacOS, Windows, or Linux to flash your Raspberry Pi and configure the device's components using the Viam app
- Hardware and supplies:
  - 1 - [Raspberry Pi 5](https://www.amazon.com/Raspberry-Single-2-4GHz-Quad-core-Cortex-A76/dp/B0CLV7DFD2)
    - Follow the [Raspberry Pi setup guide](https://docs.viam.com/installation/prepare/rpi-setup/) to make sure your Pi is flashed with a Viam-compatible operating system, and that you are able to SSH into it.
  - 1 microSD card to use with your Pi
  - 1 power supply for your Pi
  - 1 [MPU6050 GY-521 sensor module](https://www.amazon.com/Pre-Soldered-Accelerometer-Raspberry-Compatible-Arduino/dp/B0BMY15TC4)
  - 1 [LED of any color](https://amzn.to/2Ex2v5q)
  - 1 [solderless breadboard](https://www.amazon.com/dp/B0135IQ0ZC)
  - 6 [jumper wires](https://www.amazon.com/dp/B077X99KX1) to connect the sensor to the Pi

### What You’ll Need 
- All the hardware components listed in prerequisites.
- [Python3](https://www.python.org/downloads/) installed on your computer
- [VS Code](https://code.visualstudio.com/download) installed, or another similar code editor of your choice.
- Some way of getting a public URL for a local HTTP server, such as [ngrok](https://ngrok.com/) or [zrok](https://zrok.io/)
- An [Elastic stack deployment](https://www.elastic.co/guide/en/cloud/current/ec-create-deployment.html)
- Sign up for a free Viam account, and then [sign in](https://app.viam.com/fleet/dashboard) to the Viam app


### What You’ll Learn 
- how to wire a movement sensor and LED to a Raspberry Pi
- how to capture sensor data in Viam
- how to use webhooks as an [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) process between Viam and Elastic
- how to use webhooks to blink an LED based on an Elastic alert

### What You’ll Build 
- a production-ready sensor data monitoring and automation system built around Viam and Elastic

<!-- ------------------------ -->
## Hardware Setup
Duration: 2

<!-- ------------------------ -->
## Viam-Server Setup
Duration: 2

<!-- ------------------------ -->
## Machine Configuration
Duration: 2

<!-- ------------------------ -->
## Data Sync Webhook Automation
Duration: 2

<!-- ------------------------ -->
## Elasticsearch Index Setup
Duration: 2

<!-- ------------------------ -->
## Elastic Alert Rule Configuration
Duration: 2

<!-- ------------------------ -->
## Alerting Webhook Automation
Duration: 2

<!-- ------------------------ -->
## Conclusion And Resources
Duration: 1

At the end of your Viam Guide, always have a clear call to action (CTA). This CTA could be a link to the docs pages, links to videos on youtube, a GitHub repo link, etc. 

If you want to learn more about Viam Guide formatting, checkout the official documentation here: [Formatting Guide](https://github.com/googlecodelabs/tools/blob/master/FORMAT-GUIDE.md)

### What You Learned
- creating steps and setting duration
- adding code snippets
- embedding images, videos, and surveys
- importing other markdown files

### Related Resources
- <link to github code repo>
- <link to documentation>
