package com.github.theopitsihue.stise_springroll.data.WeekScedule;

import jakarta.persistence.AttributeConverter;

/// Helper class that turns weeklySchedule into a db-safe form for storing
public class WeekScheduleConverter implements AttributeConverter<WeekSchedule, String> {

    @Override
    public String convertToDatabaseColumn(WeekSchedule schedule) {
        // format: day-start-end;day-start-end;...
        return  schedule.serializedForDB();
    }

    @Override
    public WeekSchedule convertToEntityAttribute(String dbData) {
        return new WeekSchedule(dbData);
    }
}

