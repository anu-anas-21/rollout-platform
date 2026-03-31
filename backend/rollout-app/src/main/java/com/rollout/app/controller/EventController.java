package com.rollout.app.controller;

import com.rollout.app.dto.EventRequest;
import com.rollout.app.entity.EventEntity;
import com.rollout.app.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventEntity> listAll() {
        return eventService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventEntity create(@RequestBody EventRequest request) {
        return eventService.create(request);
    }
}
