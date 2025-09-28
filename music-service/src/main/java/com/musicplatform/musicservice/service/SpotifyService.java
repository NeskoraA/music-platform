package com.musicplatform.musicservice.service;

import com.musicplatform.musicservice.config.SpotifyConfig;
import com.musicplatform.musicservice.model.SpotifyTokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyService {

    private final WebClient webClient;
    private final SpotifyConfig spotifyConfig;

    // Поля для кеширования токена
    private String accessToken;
    private LocalDateTime tokenExpiry;

    public Mono<String> getAccessToken() {
        // Проверяем, не истек ли токен (с запасом 5 минут)
        if (accessToken != null && tokenExpiry != null &&
                LocalDateTime.now().isBefore(tokenExpiry)) {
            log.info("Using cached access token (expires at: {})", tokenExpiry);
            return Mono.just(accessToken);
        }

        log.info("Requesting new access token from Spotify");

        String credentials = spotifyConfig.getClientId() + ":" + spotifyConfig.getClientSecret();
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");

        return webClient.post()
                .uri(spotifyConfig.getAuthUrl())
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedCredentials)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue(formData)
                .retrieve()
                .bodyToMono(SpotifyTokenResponse.class)
                .map(tokenResponse -> {
                    this.accessToken = tokenResponse.getAccessToken();
                    // Устанавливаем время истечения (3600 секунд - 5 минут запаса)
                    this.tokenExpiry = LocalDateTime.now().plusSeconds(tokenResponse.getExpiresIn() - 300);
                    log.info("Successfully obtained NEW access token, expires at: {} (in {} seconds)",
                            tokenExpiry, tokenResponse.getExpiresIn());
                    return tokenResponse.getAccessToken();
                })
                .doOnError(error -> {
                    log.error("Error getting access token: {}", error.getMessage());
                    // Сбрасываем кеш при ошибке
                    this.accessToken = null;
                    this.tokenExpiry = null;
                });
    }

    // Поиск артистов по названию
    public Mono<String> searchArtists(String artistName) {
        return getAccessToken()
                .flatMap(token -> {
                    try {
                        String encodedQuery = java.net.URLEncoder.encode(artistName, java.nio.charset.StandardCharsets.UTF_8);
                        String url = spotifyConfig.getApiUrl() + "/search?q=" + encodedQuery + "&type=artist&limit=10";

                        log.info("Searching artists: {}", url);

                        return webClient.get()
                                .uri(url)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .onStatus(status -> status.isError(), response -> {
                                    if (response.statusCode().value() == 401) {
                                        log.warn("Token expired, resetting cache");
                                        this.accessToken = null;
                                        this.tokenExpiry = null;
                                    }
                                    return response.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(new RuntimeException("Spotify API error: " + response.statusCode() + " - " + body)));
                                })
                                .bodyToMono(String.class);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .doOnSuccess(artists -> log.info("Successfully searched artists: {}", artistName))
                .doOnError(error -> log.error("Error searching artists: {}", error.getMessage()));
    }

    // Поиск альбомов по названию
    public Mono<String> searchAlbums(String albumName) {
        return getAccessToken()
                .flatMap(token -> {
                    try {
                        String encodedQuery = java.net.URLEncoder.encode(albumName, java.nio.charset.StandardCharsets.UTF_8);
                        String url = spotifyConfig.getApiUrl() + "/search?q=" + encodedQuery + "&type=album&limit=10";

                        log.info("Searching albums: {}", url);

                        return webClient.get()
                                .uri(url)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .onStatus(status -> status.isError(), response -> {
                                    if (response.statusCode().value() == 401) {
                                        log.warn("Token expired, resetting cache");
                                        this.accessToken = null;
                                        this.tokenExpiry = null;
                                    }
                                    return response.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(new RuntimeException("Spotify API error: " + response.statusCode() + " - " + body)));
                                })
                                .bodyToMono(String.class);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .doOnSuccess(albums -> log.info("Successfully searched albums: {}", albumName))
                .doOnError(error -> log.error("Error searching albums: {}", error.getMessage()));
    }

    // Поиск треков по названию
    public Mono<String> searchTracks(String trackName) {
        return getAccessToken()
                .flatMap(token -> {
                    try {
                        String encodedQuery = java.net.URLEncoder.encode(trackName, java.nio.charset.StandardCharsets.UTF_8);
                        String url = spotifyConfig.getApiUrl() + "/search?q=" + encodedQuery + "&type=track&limit=10";

                        log.info("Searching tracks: {}", url);

                        return webClient.get()
                                .uri(url)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .onStatus(status -> status.isError(), response -> {
                                    if (response.statusCode().value() == 401) {
                                        log.warn("Token expired, resetting cache");
                                        this.accessToken = null;
                                        this.tokenExpiry = null;
                                    }
                                    return response.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(new RuntimeException("Spotify API error: " + response.statusCode() + " - " + body)));
                                })
                                .bodyToMono(String.class);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .doOnSuccess(tracks -> log.info("Successfully searched tracks: {}", trackName))
                .doOnError(error -> log.error("Error searching tracks: {}", error.getMessage()));
    }

    // Универсальный поиск (все типы)
    public Mono<String> searchAll(String query) {
        return getAccessToken()
                .flatMap(token -> {
                    try {
                        String encodedQuery = java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8);
                        String url = spotifyConfig.getApiUrl() + "/search?q=" + encodedQuery + "&type=artist,album,track&limit=5";

                        log.info("Universal search: {}", url);

                        return webClient.get()
                                .uri(url)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .onStatus(status -> status.isError(), response -> {
                                    if (response.statusCode().value() == 401) {
                                        log.warn("Token expired, resetting cache");
                                        this.accessToken = null;
                                        this.tokenExpiry = null;
                                    }
                                    return response.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(new RuntimeException("Spotify API error: " + response.statusCode() + " - " + body)));
                                })
                                .bodyToMono(String.class);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .doOnSuccess(results -> log.info("Successfully searched: {}", query))
                .doOnError(error -> log.error("Error searching: {}", error.getMessage()));
    }

    // Метод для получения информации о текущем токене
    public String getTokenInfo() {
        if (accessToken == null) {
            return "No token cached";
        }
        String tokenPreview = accessToken.length() > 20 ?
                accessToken.substring(0, 20) + "..." : accessToken;
        return String.format("Token: %s (expires: %s)", tokenPreview, tokenExpiry);
    }
}