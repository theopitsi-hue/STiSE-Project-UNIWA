package com.github.theopitsihue.stise_springroll.data.WeekScedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor

public class WeekSchedule {

    private Map<DayOfWeek, OpenCloseTime> dailyHours = new HashMap<>();

    public WeekSchedule() {
        this("0-09:00-14:00;" +  // monday
                "1-09:00-14:00;" +  // tuesday
                "2-09:00-14:00;" +  //wensday
                "3-09:00-14:00;" +  // thursday
                "4-09:00-14:00;" +  //friday
                "5-09:00-14:00;" +  // saturday
                "6-09:00-14:00;" //sunday
        );
    }


    public WeekSchedule(String compactSchedule) {
        this.dailyHours = new HashMap<>();
        if (compactSchedule == null || compactSchedule.isBlank()) return;

        String[] entries = compactSchedule.split(";");
        for (String entry : entries) {
            String[] parts = entry.split("-");
            if (parts.length != 3) continue;

            try {
                int dayIndex = Integer.parseInt(parts[0]);
                // Java DayOfWeek: MONDAY = 1 ... SUNDAY = 7
                DayOfWeek day = DayOfWeek.of((dayIndex % 7) + 1);

                LocalTime start = LocalTime.parse(parts[1]);
                LocalTime end = LocalTime.parse(parts[2]);
                dailyHours.put(day, new OpenCloseTime(start, end));
            } catch (Exception e) {
                // skip invalid entries
                System.err.println("Invalid schedule entry: " + entry);
            }
        }
    }

    public String serializedForDB() {
        // format:day-start-end;day-start-end;...

        if (getDailyHours().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        getDailyHours().forEach((day, times) -> {
            sb.append(day.ordinal())
                    .append("-")
                    .append(times.getOpen().toString())
                    .append("-")
                    .append(times.getClose().toString())
                    .append(";");
        });
        return sb.toString();
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OpenCloseTime {
        private LocalTime open;
        private LocalTime close;
    }

    public boolean isOpen(DayOfWeek day, LocalTime time) {
        OpenCloseTime range = dailyHours.get(day);
        return range != null && !time.isBefore(range.open) && !time.isAfter(range.close);
    }

    public String toFancyString() {
        StringBuilder builder = new StringBuilder();
        getDailyHours().forEach((day, times) -> {
            builder.append(day.toString())
                    .append(": ")
                    .append(times.getOpen().toString())
                    .append("-")
                    .append(times.getClose().toString())
                    .append("\n");
        });
        return builder.toString();
    }
}
