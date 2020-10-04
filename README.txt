### Byron BY series doorbells
Homey app to receive signals from Byron BY doorbell pushbuttons; and to send signal to Byron BY doorbell chimes.

These devices are supported:

Doorbell push buttons:
* BY30 tested
* BY32
* BY33
* BY34
* BY35
* BY37
* BY37Z

Doorbell chimes:
* BY101
* BY102
* BY103
* BY112
* BY201
* BY201F
* BY202
* BY202F
* BY206E
* BY206FE
* BY212
* BY216
* BY216E
* BY216FE
* BY236E
* BY236FE
* BY301
* BY302
* BY401B
* BY401W tested
* BY403
* BY501E
* BY502E
* BY502ZE
* BY503ZE
* BY504E
* BY511E
* BY514E
* BY532E
* BY535E
* BY601E
* BY611E


Depending on the model, the list of possible sounds is adjusted.

Please tell me when you have a Byron BY device that is not listed here.
Please tell me when you have a Byron BY device that is properly working with Homey, but which is not yet marked as 'tested' here.

### Installation
Install the app and add the App to a flow. You can use the generic Byron BY application as a starting trigger, or as an action in a flow. In that case you are required to manually fill in the bell-id that is used. Better, you can pair a Byron BY button and/or a Byron BY ringer and use these in a flow.

#### Activity

When the card is added to the condition column, it detects a Byron BY push button being pushed. 3 parameters are added to the trigger:
* buttonId:
Contains the internal ID of the button that is pushed. This is a number between 0 and 8191. This number is assigned randomly to a push button once the battery is inserted.
* melodyNr:
Contains the melody number of the melody that was chosen. This is a number between 1 and 8. These are the numbers that are listed in the manual that comes with the device. Some bells only support 4 melodies. Some bells support only 6 melodies.
* melodyId:
Contains the internal ID of the melody that was chosen. This is a number between 0 and 7. This number can be changed by pushing the small button that is inside the push button.

When the card is added to the action column, it is able to send a signal to a Byron BY bell. There are separate cards for each category of bell. There are 3 categories. A 4th card is available, which allows all 8 melody IDs. The hint icon shows the exact models that are supported by that card. But you can also pick the card that has the list of ringtones that matches your Byron BY bell. This card takes a few parameters:
* buttonId:
Contains the internal ID of the button that is recognized by the bell. This is a number between 0 and 8191. Typically, this is the same number as is sent by the push button.
* melodyNr:
Contains the melody that should be played by the bell. You can select the melody from a dropdown list. When you select the proper card, the list of melodies should exactly match with what is possible. This parameter is not available for bells that have only one melody.
* melodyId:
Contains the melody that should be played by the bell. You can select the melody by its internal number. Note that the internal numbers are not equal to the sequence number suggested by the dropdown lists.

You may create more complicated scenarios where you let the Homey flow decide whether or not to send a command to the bell. First pair be bell so that it has a known internal ID. Then remove the batteries from the push button and reinsert them. This gives the push button a new random internal ID. Unless you are unlucky, the push button now has a different internal ID than the bell. You can use this to let your Homey decide whether the bell should indeed ring.

#### Protocols
The Byron BY series push buttons and bells all use the same 433MHz-based protocol. It uses a simple message consisting of 13 bits for the push button identification and 3 bits for the melody identification. This would suggest 8192 possible IDs and 8 possible ringtones. Depending on the models of your push button and bell, less combinations may be in use.
