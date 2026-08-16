package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.EmissionFactorDto;
import java.time.LocalDate;
import java.util.List;

public interface EmissionFactorService {
    EmissionFactorDto create(EmissionFactorDto dto, String createdBy);
    List<EmissionFactorDto> getAll();
    List<EmissionFactorDto> getByActivityType(Long activityTypeId);
    EmissionFactorDto getById(Long id);
    EmissionFactorDto update(Long id, EmissionFactorDto dto, String updatedBy);
    void delete(Long id);
    EmissionFactorDto getActiveFactorForActivityType(Long activityTypeId);
    EmissionFactorDto getActiveFactorForActivityType(Long activityTypeId, LocalDate date);
}
