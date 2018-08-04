#!/usr/bin/env bash
docker login registry.gitlab.worldline.tech && docker pull registry.gitlab.worldline.tech/johann.vanackere/wl-football-league:latest && docker run -d --name wl-football-league -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf -p 9090:80 registry.gitlab.worldline.tech/johann.vanackere/wl-football-league:latest
