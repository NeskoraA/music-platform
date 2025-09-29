package com.musicplatform.musicservice.controller;

import com.musicplatform.musicservice.service.SpotifyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
@Tag(name = "Music Controller", description = "API для поиска музыки в Spotify")
public class MusicController {

    private final SpotifyService spotifyService;

    @GetMapping("/token")
    @Operation(summary = "Получить access token от Spotify")
    public Mono<ResponseEntity<String>> getToken() {
        log.info("Request received for Spotify access token");
        return spotifyService.getAccessToken()
                .map(token -> ResponseEntity.ok("Access Token: " + token))
                .doOnSuccess(response -> log.info("Token request completed successfully"))
                .doOnError(error -> log.error("Token request failed: {}", error.getMessage()));
    }

    @GetMapping("/token-info")
    @Operation(summary = "Информация о текущем токене")
    public ResponseEntity<String> getTokenInfo() {
        log.debug("Token info requested");
        return ResponseEntity.ok(spotifyService.getTokenInfo());
    }

    @GetMapping("/search/artists")
    @Operation(summary = "Поиск артистов по названию")
    public Mono<ResponseEntity<String>> searchArtists(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit) {

        log.info("Artist search request for: {} (offset: {}, limit: {})", q, offset, limit);
        return spotifyService.searchArtists(q, offset, limit)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Artist search completed successfully"))
                .doOnError(error -> log.error("Artist search failed: {}", error.getMessage()));
    }

    @GetMapping("/search/albums")
    @Operation(summary = "Поиск альбомов по названию")
    public Mono<ResponseEntity<String>> searchAlbums(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit) {

        log.info("Album search request for: {} (offset: {}, limit: {})", q, offset, limit);
        return spotifyService.searchAlbums(q, offset, limit)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Album search completed successfully"))
                .doOnError(error -> log.error("Album search failed: {}", error.getMessage()));
    }

    @GetMapping("/search/tracks")
    @Operation(summary = "Поиск треков по названию")
    public Mono<ResponseEntity<String>> searchTracks(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit) {

        log.info("Track search request for: {} (offset: {}, limit: {})", q, offset, limit);
        return spotifyService.searchTracks(q, offset, limit)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Track search completed successfully"))
                .doOnError(error -> log.error("Track search failed: {}", error.getMessage()));
    }

    @GetMapping("/search")
    @Operation(summary = "Универсальный поиск (артисты, альбомы, треки)")
    public Mono<ResponseEntity<String>> searchAll(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit) {

        log.info("Universal search request for: {} (offset: {}, limit: {})", q, offset, limit);
        return spotifyService.searchAll(q, offset, limit)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Universal search completed successfully"))
                .doOnError(error -> log.error("Universal search failed: {}", error.getMessage()));
    }

    @GetMapping("/health")
    @Operation(summary = "Проверка здоровья сервиса")
    public ResponseEntity<String> health() {
        log.debug("Health check requested");
        return ResponseEntity.ok("Music Service is healthy");
    }
}