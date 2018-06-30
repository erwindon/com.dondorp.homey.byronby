
### Byron BY series doorbells
Homey app to receive signals from Byron BY doorbell pushbuttons; and to send signal to Byron BY doorbell chimes.

These devices are supported:

Doorbell push buttons:
* BY30 tested
* BY32 
* BY33
* BY35
* BY38
* BY39

Doorbell chimes:
* BY1i
* BY4i
* BY5i
* BY6
* BY7
* BY8i
* BY11i
* BY14
* BY15
* BY15i
* BY21
* BY20
* BY34i
* BY40i
* BY41i
* BY55
* BY56
* BY60i
* BY72
* BY80 tested
* BY81
* BY83
* BY86
* BY102
* BY120
* BY201
* BY202
* BY204
* BY205
* BY209
* BY210i
* BY212i
* BY220
* BY222
* BY225
* BY226
* BY228
* BY245
* BY252
* BY823

Depending on the model, the list of possible sounds is adjusted.

Please tell me when you have a Byron BY device that is not listed here.
Please tell me when you have a Byron BY device that is properly working with Homey, but which is not yet marked as 'tested' here.

### Installation
Install the app and add the App to a flow. You can use the generic Byron BY application as a starting trigger, or as an action in a flow. In that case you are required to manually fill in the bell-id that is used. Better, you can pair a Byron BY button and/or a Byron BY ringer and use these in a flow.

#### Activity

When the card is added to the condition column, it detects a Byron BY push button being pushed. 3 parameters are added to the trigger:
* buttonId:
Contains the internal ID of the button that is pushed. This is a number between 0 and 255. This number is assigned randomly to a push button once the battery is inserted.
* melodyNr:
Contains the melody number of the melody that was chosen. This is a number between 1 and 8. These are the numbers that are listed in the manual that comes with the device. Some bells only support 4 melodies. Some bells support only 1 melody or are mechanical bells.
* melodyId:
Contains the internal ID of the melody that was chosen. This is a number between 0 and 15. But only 8 specific values seem to in use. This number can be changed by pushing the small button that is inside the push button.

When the card is added to the action column, it is able to send a signal to a Byron BY bell. There are separate cards for each category of bell. There are 6 categories. A 7th card is available, which allows all 16 melody IDs. The hint icon shows the exact models that are supported by that card. But you can also pick the card that has the list of ringtones that matches your Byron BY bell. This card takes a few parameters:
* buttonId:
Contains the internal ID of the button that is recognized by the bell. This is a number between 0 and 255. Typically, this is the same number as is sent by the push button.
* melodyNr:
Contains the melody that should be played by the bell. You can select the melody from a dropdown list. When you select the proper card, the list of melodies should exactly match with what is possible. This parameter is not available for bells that have only one melody.
* melodyId:
Contains the melody that should be played by the bell. You can select the melody by its internal number. Note that the internal numbers are not equal to the sequence number suggested by the dropdown lists.

You may create more complicated scenarios where you let the Homey flow decide whether or not to send a command to the bell. First pair be bell so that it has a known internal ID. Then remove the batteries from the push button and reinsert them. This gives the push button a new random internal ID. Unless you are unlucky, the push button now has a different internal ID than the bell. You can use this to let your Homey decide whether the bell should indeed ring.

#### Protocols
The Byron BY series push buttons and bells all use the same 433MHz-based protocol. It uses a simple message consisting of 8 bits for the push button identification and 4 bits for the melody identification. This would suggest 256 possible IDs and 16 possible ringtones. Depending on the models of your push button and bell, less combinations may be in use.

### Discussion and issues
Please report issues via [GitHub](https://github.com/erwindon/com.dondorp.homey.byronby/issues). For other remarks and/or questions mail byronby@dondorp.com.

### Version info
* 1.0.0 First Athom App Store release candidate

----------

Copyright (c) 2018 Erwin Dondorp

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
