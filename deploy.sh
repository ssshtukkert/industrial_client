#!/bin/bash
clear
quasar build -m pwa ; docker restart nginx
