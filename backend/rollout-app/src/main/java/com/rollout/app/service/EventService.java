package com.rollout.app.service;

import com.rollout.app.dto.EventRequest;
import com.rollout.app.entity.EventEntity;
import com.rollout.app.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventEntity> findAll() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    public EventEntity create(EventRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (request.getDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is required");
        }
        if (request.getLocation() == null || request.getLocation().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is required");
        }
        EventEntity event = EventEntity.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .date(request.getDate())
                .location(request.getLocation().trim())
                .build();
        return eventRepository.save(event);
    }
}
