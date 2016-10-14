import React, { Component } from "react"

import GetPosts from "../components/GetPosts"

import { fetchPosts } from "../utils/reddit"
import { goToGoogleOAuthWindow, validateToken, createPlaylist } from "../utils/youtube"
import { isYoutubeUrl } from "../utils/helpers"