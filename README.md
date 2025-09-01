<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
<!--   <a href="https://github.com/jtran217/astro-vision">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">Astro Vision</h3>

  <p align="center">
    Astro Vision is a web-based application that allows casual volleyball players and teams to upload their match footage, manually tag in-game events, and track performance statistics. Players can log key actions such as spikes, serves, receives, and rallies, with each tagged event contributing to detailed performance insights.

The initial version of Astro Vision focuses on manual tagging, enabling users to categorize plays as successful or unsuccessful and view aggregated stats over time. This provides teams with a structured way to evaluate their strengths and areas for improvement, even without professional tools.

Looking ahead, the project aims to integrate machine learning models to automatically detect and classify volleyball events from uploaded footage. By leveraging computer vision and activity recognition techniques, Astro Vision will reduce the need for manual input and provide real-time analytics.

This project serves as a foundation for blending sports, technology, and AI, with the long-term vision of making advanced performance analysis tools accessible to recreational athletes and community teams.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#frontend">Frontend</a>
          <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#installation">Installation</a></li>
          </ul>
        </li>
        <li><a href="#backend">Backend</a>
          <ul>
            <li><a href="#prerequisites-1">Prerequisites</a></li>
            <li><a href="#installation-1">Installation</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#manual-tagging-videos">Manual Tagging Videos</a></li>
        <li><a href="#training-the-ml-model">Training the ML Model</a>
          <ul>
            <li><a href="#transforming-csv---clean-ml-ready-format">Transforming CSV → Clean ML Ready Format</a></li>
            <li><a href="#extracting-clips">Extracting Clips</a></li>
            <li><a href="#spliting-the-dataset">Splitting the Dataset</a></li>
            <li><a href="#training-ceenter-frame-resnet-18-classifer">Training Center-Frame ResNet-18 Classifier</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#roadmap">Roadmap</a>
      <ul>
        <li><a href="#baseline-done">Baseline (DONE)</a></li>
        <li><a href="#data-quality-and-balance">Data Quality and Balance</a></li>
        <li><a href="#short-clip-temporal-model">Short-Clip Temporal Model</a></li>
        <li><a href="#api-mvp">API MVP</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
<img src="https://res.cloudinary.com/dittybzbt/image/upload/v1756346677/astro_vision_front_end_gmesps.png"/>
This project was inspired by the lack of affordable and user-friendly tools for volleyball players who want to review their gameplay outside of professional or elite-level software. The platform is being developed with a Next.js frontend and will eventually integrate a FastAPI backend for managing video uploads, tagging data, and model predictions.

At the current stage, the tagging feature is limited to a closed group of six team members for testing, and there is no editing functionality yet once a tag has been created. The primary technical challenge underway is training a machine learning model that can accurately classify and predict the outcomes of in-game actions from video clips. This will allow AstroVision to move beyond manual tagging and into automated, AI-assisted video analysis.

In the near term, AstroVision aims to expand tagging capabilities beyond the initial team and introduce editing features for greater flexibility. Longer-term goals include integrating the trained ML model, building out player statistics dashboards, and optimizing the site for scalable use.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Next.js
* Python
* PyTorch
* OpenCV

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Frontend

#### Prerequisites

* Before running the frontend locally, make sure you have:
  * [Node.js](https://nodejs.org/) version 18.x or higher
  *  npm (comes with Node.js)
  *  [Git](https://git-scm.com/) for cloning the repository 

#### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jtran217/astro-vision.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Running the repo `config.js`
   ```sh
   npm run dev
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Backend

#### Prerequisites
* Before running the backend locally make sure you have:
*  * Python 3.10+
   * ffmpeg on PATH (used by the clip extractor)
   *  * macOS(Homebrew): `brew install ffmpeg`
      * Windows(Chocolatey): `choco install ffmpeg`
      * Verify: `ffmpeg -version`

#### Installation 
```sh
pip install -r backend/requirements.txt
```

<!-- USAGE EXAMPLES -->
## Usage

### Manual Tagging Videos:

![Click Upload](https://res.cloudinary.com/dittybzbt/image/upload/v1756649296/clickUpload_tgca8w.png)

* Click on upload video and select video

![Success Upload](https://res.cloudinary.com/dittybzbt/image/upload/v1756649946/successUpload_uttrqv.png)
![Tag Display](https://res.cloudinary.com/dittybzbt/image/upload/v1756649955/tagDisplay_lsjwrd.png)

* The video player should load the video and allow manual tagging.
  * In the tagging panel, the user can select the player, event type, and outcome, then add the tag to save. Tags are displayed in the timeline area, where unnecessary tags can be removed.
  * The user can easily start and stop video playback with the **spacebar**. The **left arrow key** rewinds 2 seconds, and the **right arrow key** fast-forwards 2 seconds.
* Once tagging is finished, the user can export the results as either a JSON or CSV file.
* Initially, JSON was supported and planned to be used for training the ML model, but the project eventually switched to using Excel instead.

### Training the ML Model:
* The first step is to ensure that the video used for tagging is moved to the `backend/data/videos` folder and that the CSV file is the `backend/data/raw` folder.
  
#### Transforming CSV -> CLean ML Ready Format:
* To make the data more friendly for the model, we run the `transform_csv` script in the `backend/scripts` folder.

``` sh
python .\scripts\transform_csv.py --in .\data\raw\analysis-2025-07-25.csv --out .\data\processed\manifest1.csv
```
* The `--in` argument specifies the location of the tagged CSV file.  
* The `--out` argument defines the output path and filename (e.g., `manifest1.csv`) for the ML-ready CSV file.  

* A successful run will display an output similar to the example below in the terminal:
```sh
Read 160 rows → wrote 160, skipped 0
Action counts: {'serve': 33, 'block': 31, 'pass': 48, 'spike': 23, 'set': 25}
```
#### Extracting Clips:
* Next step is to create short clips of where the action occured to use as training for the model.
* To do this we run the `extract_clips.py` script
```sh
python .\scripts\extract_clips.py  --manifest .\data\processed\manifest1.csv --video-root .\data\videos --out-dir .\data\clips\
```
* A successful output will display:
``` sh
Scanned manifest rows: 160
Wrote clips: 160 → clips_index.csv
Per-action counts: {'serve': 33, 'block': 31, 'pass': 48, 'spike': 23, 'set': 25}
```
* The script command above will store the clips in the `data/clips` folder. By default the clips are 1 second pre and 2 seconds post, thus overall clips lengths of 3 seconds are created.
* Furthermore, the script generates a clips_index.csv that will be used in the next step.

#### Spliting the Dataset:
* To split the dataset, run the `make_splits.py` script. By default, the data is divided into 70% training, 15% validation, and 15% test. The script generates three csv files that record which video clips belong to each set.
* The command below will store these csv in the `data/splits` folder.
``` sh
python .\scripts\make_splits.py --index .\data\clips\clips_index.csv --out-dir .\data\splits\
```
* A successful run the command will display a similar output below:
``` sh
    ✅ splits written:
      train: data\splits\train.csv {'block': 21, 'pass': 34, 'serve': 23, 'set': 17, 'spike': 17}
      val  : data\splits\val.csv {'block': 5, 'pass': 7, 'serve': 5, 'set': 4, 'spike': 3}
      test : data\splits\test.csv {'block': 5, 'pass': 7, 'serve': 5, 'set': 4, 'spike': 3}
```

#### Training Ceenter-Frame ResNet-18 Classifer:
* Why this model: We start with a single middle-frame image model because it’s quick to train, easy to debug, and gives a solid starting score before we try more complex video models.
``` sh
python .\scripts\train_baseline_frame.py --splits-dir .\data\splits\ --epoch 10 --batch-size 32
```
* A successful run should display the following:
``` sh
Epoch 01 | train loss 1.5240 acc 0.384 | val loss 3.1779 acc 0.208
Epoch 02 | train loss 0.6393 acc 0.723 | val loss 1.9027 acc 0.500
Epoch 03 | train loss 0.4626 acc 0.848 | val loss 2.7729 acc 0.458
Epoch 04 | train loss 0.3211 acc 0.893 | val loss 1.7058 acc 0.333
Epoch 05 | train loss 0.1380 acc 0.955 | val loss 1.3105 acc 0.625
Epoch 06 | train loss 0.1055 acc 0.964 | val loss 4.8146 acc 0.542
Epoch 07 | train loss 0.0792 acc 0.955 | val loss 9.1778 acc 0.292
Epoch 08 | train loss 0.1009 acc 0.955 | val loss 7.4453 acc 0.333
Epoch 09 | train loss 0.0572 acc 0.973 | val loss 3.7940 acc 0.458
Epoch 10 | train loss 0.0486 acc 0.973 | val loss 1.8938 acc 0.458
TEST  | loss 1.1718 acc 0.708
```
* Currently, the model achieves ~71% test accuracy (N=161). Based on these results, my next steps are: (1) improve data quality by adding more tagged clips and balancing classes; (2) move from a single-frame model to a short-clip model to capture temporal context.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

### Baseline (DONE)
- [x] Center-frame **ResNet-18** classifier (ImageNet pretrained)  
- [x] Scripts: tags → manifest → clips → splits → train → eval  
- [x] Result: **~71% test accuracy (N=161)**

### Data Quality and Balance
- [ ] Add ≥ **+300** tagged clips (spread across actions)
- [ ] Class imbalance: **minority/majority ≥ 0.8** or use weighted sampling
- [ ] Validate splits (no duplicate clips across train/val/test)
- [ ] Re-train baseline → aim for +2–4 percentage points in overall accuracy (e.g., 71% → 73–75%), and +5 percentage points in recall for the weakest action.

### Short-Clip Temporal Model
- [ ] Extract **8–16 frames** per event (centered)
- [ ] Implement a 3D CNN / SlowFast-tiny (or frame-stack with 2D backbone)
- [ ] Compare against baseline on the **same test set**
- [ ] Goal: For hard actions (e.g., set), catch 5–10 more correct plays out of every 100
      
### API MVP
- [ ] **FastAPI** `/analyze` endpoint: input video/URL → JSON summary
- [ ] Batch inference pipeline: decode → sample frames → predict → aggregate
- [ ] Basic schema: `{ players: {name: {spike:{attempts,success}, ...}}, totals: {...} }`
- [ ] Add a tiny **demo set** + `run_all.sh`


<p align="right">(<a href="#readme-top">back to top</a>)</p>


