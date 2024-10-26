"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  isDateToday,
  isGreaterThanTodayDate,
  isSameDate,
  isSameMonth,
} from "@/shared/ui/calendar/utils/date";
import CalendarLeftArrowButton from "@/shared/ui/calendar/CalendarLeftArrowButton";
import CalendarRightArrowButton from "@/shared/ui/calendar/CalendarRightArrowButton";

enum Weekday {
  Sun = 0,
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
}

const DateVariants = {
  default: "text-gray-90",
  hover:
    "group-hover:rounded-full group-hover:rounded-full group-hover:bg-gray-10 group-hover:scale-110",
  selectedBackground:
    "scale-110 bg-green-60 text-white rounded-full group-hover:bg-green-60 group-hover:text-white",
  selectedText: "text-white",
};

const MonthVariants = {
  default:
    "text-body-1 text-gray-90 rounded-full font-regular group-hover:rounded-full group-hover:bg-gray-10 disabled:text-gray-30 hover:bg-gray-10",
  selected: "bg-green-60 text-white hover:bg-green-60",
};

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  disableKrHoliday?: boolean;
}

// DatePicker 컴포넌트
const Calendar = ({
  selectedDate = null,
  onSelectDate,
  disableKrHoliday,
}: CalendarProps) => {
  // 현재 날짜와 선택된 날짜 상태
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  // 달력 모드 또는 월 선택 모드 상태
  const [isMonthMode, setIsMonthMode] = useState(false);

  // 현재 연도 및 월 계산
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 0-based index이므로 +1 필요

  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    if (!disableKrHoliday) return;
    const filePath =
      "/data/holiday/" +
      currentYear +
      "-" +
      (currentMonth < 10 ? "0" + currentMonth : currentMonth) +
      ".xml";

    const xml = new XMLHttpRequest();
    xml.open("GET", filePath, false);
    xml.send();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml.responseText, "text/xml");
    const dates = xmlDoc.getElementsByTagName("locdate");

    const disabledDates: string[] = [];

    for (let i = 0; i < dates.length; i++) {
      let textContent = dates[i].textContent;
      if (!textContent) {
        continue;
      }
      // 20240101 -> 2024-01-01
      const regex = /(\d{4})(\d{2})(\d{2})/;
      const textDate = textContent.replace(regex, "$1-$2-$3");

      disabledDates.push(textDate);
    }
    setDisabledDates(disabledDates);
  }, [currentYear, currentMonth, disableKrHoliday]);

  // 이전 달의 마지막 날짜
  const lastDateOfPrevMonth = new Date(
    currentYear,
    currentMonth - 1,
    0,
  ).getDate();

  // 해당 월의 총 일수 계산
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  // 해당 월의 첫째 날의 요일 계산
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  // 달력에 표시할 주 수 계산
  const calendarWeekAmount = Math.ceil((firstDay + daysInMonth) / 7);

  // 달력을 월별 선택 모드로 전환
  const switchToMonthMode = () => {
    setIsMonthMode(true);
  };

  // 날짜 선택 처리 함수
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth - 1, day);
    onSelectDate(newDate);
  };

  // 월 선택 처리 함수
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentYear, month - 1, 1);
    setCurrentDate(newDate);
    setIsMonthMode(false);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth, 1);
    setCurrentDate(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 2, 1);
    setCurrentDate(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(currentYear + 1, currentMonth - 1, 1);
    setCurrentDate(newDate);
  };

  const handlePrevYear = () => {
    const newDate = new Date(currentYear - 1, currentMonth - 1, 1);
    setCurrentDate(newDate);
  };

  // 현재 달의 일자들을 생성
  const generateDaysInMonth = () => {
    const daysArray: {
      day: number;
      variant: (typeof DateVariants)[keyof typeof DateVariants];
    }[] = [];

    for (let week = 1; week <= calendarWeekAmount; ++week) {
      for (let day = Weekday.Sun; day <= Weekday.Sat; day++) {
        // 달력의 첫 주 중 이전 달의 마지막 날짜 채워넣는 분기점.
        if (week === 1 && day < firstDay) {
          daysArray.push({
            day: lastDateOfPrevMonth - firstDay + day + 1,
            variant: "disabled",
          });
          // 달력의 마지막 주 중 다음 달의 첫 날짜 채워넣는 분기점.
        } else if ((week - 1) * 7 + day - firstDay + 1 > daysInMonth) {
          daysArray.push({
            day: (week - 1) * 7 + day - firstDay - daysInMonth + 1,
            variant: "disabled",
          });
        } else {
          let variant: "default" | "disabled" = "default";

          if (
            isGreaterThanTodayDate(
              new Date(
                currentYear,
                currentMonth - 1,
                (week - 1) * 7 + day - firstDay + 1,
              ),
            )
          ) {
            variant = "disabled";
          }

          if (
            disabledDates.includes(
              `${currentYear}-${currentMonth < 10 ? "0" + currentMonth : currentMonth}-${
                (week - 1) * 7 + day - firstDay + 1 < 10
                  ? "0" + ((week - 1) * 7 + day - firstDay + 1)
                  : (week - 1) * 7 + day - firstDay + 1
              }`,
            )
          ) {
            variant = "disabled";
          }

          if (
            [Weekday.Sun, Weekday.Sat].includes(
              new Date(
                currentYear,
                currentMonth - 1,
                (week - 1) * 7 + day - firstDay + 1,
              ).getDay(),
            )
          ) {
            variant = "disabled";
          }

          // 실제 해당 월의 날짜들을 채워넣는 부분
          daysArray.push({
            day: (week - 1) * 7 + day - firstDay + 1,
            variant,
          });
        }
      }
    }

    return daysArray;
  };

  // 1월~12월까지 선택 가능하도록 배열 생성
  const generateMonths = () => {
    const months: number[] = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    return months;
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="datepicker-header">
        <div className={"flex flex-row items-center justify-between"}>
          <CalendarLeftArrowButton
            onClick={isMonthMode ? handlePrevYear : handlePrevMonth}
          />
          {isMonthMode ? (
            <button className="cursor-default text-body-4 font-bold">
              {currentYear}
            </button>
          ) : (
            <button
              className="text-body-4 font-bold"
              onClick={switchToMonthMode}
            >{`${currentYear}.${currentMonth}`}</button>
          )}
          {!isMonthMode &&
          isGreaterThanTodayDate(new Date(currentYear, currentMonth, 1)) ? (
            <div className="h-5 w-5" />
          ) : isMonthMode &&
            isGreaterThanTodayDate(new Date(currentYear + 1, 0, 1)) ? (
            <div className="h-5 w-5" />
          ) : (
            <CalendarRightArrowButton
              onClick={isMonthMode ? handleNextYear : handleNextMonth}
            />
          )}
        </div>
      </div>

      <div className="datepicker-body">
        {isMonthMode ? (
          // 월별 선택 모드
          <div className="grid grid-cols-3 gap-x-[34px] gap-y-[11px]">
            {generateMonths().map((month) => (
              <button
                key={month}
                disabled={isGreaterThanTodayDate(
                  new Date(currentYear, month - 1, 1),
                )}
                className={cn(
                  "h-9 w-9",
                  MonthVariants.default,
                  isSameMonth(
                    selectedDate,
                    new Date(currentYear, month - 1, 1),
                  ) && MonthVariants.selected,
                )}
                onClick={() => handleMonthSelect(month)}
              >
                {month}
              </button>
            ))}
          </div>
        ) : (
          // 달력 모드
          <div className="flex flex-col gap-[7px]">
            <div className="grid grid-cols-7">
              {["일", "월", "화", "수", "목", "금", "토"].map(
                (weekday, index) => (
                  <div
                    key={`weekday-${index}`}
                    className="flex h-[22px] w-[30px] items-center justify-center text-body-5 text-gray-70"
                  >
                    {weekday}
                  </div>
                ),
              )}
            </div>
            <div className="grid grid-cols-7 gap-y-[6px]">
              {generateDaysInMonth().map((day, index) => (
                <button
                  key={`day-${index}`}
                  className={cn(
                    "group relative h-[22px] w-[30px] overflow-visible text-body-5 disabled:text-gray-30",
                    DateVariants.default,
                  )}
                  disabled={day.variant === "disabled"}
                  onClick={() => handleDateSelect(day.day)}
                >
                  {!isDateToday(selectedDate) &&
                    isDateToday(
                      new Date(currentYear, currentMonth - 1, day.day),
                    ) && (
                      <span className="absolute -top-[2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-60" />
                    )}
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2",
                      DateVariants.hover,
                      isSameDate(
                        selectedDate,
                        new Date(currentYear, currentMonth - 1, day.day),
                      )
                        ? DateVariants.selectedBackground
                        : "",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 flex h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                      isSameDate(
                        selectedDate,
                        new Date(currentYear, currentMonth - 1, day.day),
                      )
                        ? DateVariants.selectedText
                        : "",
                    )}
                  >
                    {day.day}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
