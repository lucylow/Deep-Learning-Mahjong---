import { describe, expect, it } from "vitest";
import { localizedReplayAction, localizedReplayFilterSummary, localizedReplaySeatFilterAccessibilityLabel, localizedReplaySeatFilterLabel, localizedReplayStatusLabel, tileAccessibilityLabel, tileSuitLabel } from "@/shared/mahjong-labels";

describe("Mahjong localized labels", () => {
  it("uses script-specific tile-suit names", () => {
    expect(tileSuitLabel("m", "zh-Hans")).toBe("万");
    expect(tileSuitLabel("m", "zh-Hant")).toBe("萬");
    expect(tileSuitLabel("p", "zh-Hans")).toBe("筒");
    expect(tileSuitLabel("s", "zh-Hant")).toBe("索");
    expect(tileSuitLabel("h", "zh-Hans")).toBe("字牌");
  });

  it("keeps Chinese tile accessibility states understandable", () => {
    expect(tileAccessibilityLabel("m5", "zh-Hans", true, false)).toBe("万 5，已选中");
    expect(tileAccessibilityLabel("p3", "zh-Hant", false, true)).toBe("筒 3，可打出的合法牌");
  });

  it("localizes replay filters, seat accessibility, and lifecycle status by script", () => {
    expect(localizedReplaySeatFilterLabel("zh-Hans", "all")).toBe("全部座位");
    expect(localizedReplaySeatFilterLabel("zh-Hant", 2)).toBe("座位 2");
    expect(localizedReplaySeatFilterAccessibilityLabel("zh-Hans", 1)).toBe("显示回放座位 1");
    expect(localizedReplayFilterSummary("zh-Hant", "all")).toBe("已篩選：全部座位");
    expect(localizedReplayStatusLabel("zh-Hans", "confirmed")).toBe("已确认");
    expect(localizedReplayStatusLabel("zh-Hant", "rejected")).toBe("已拒絕");
    expect(localizedReplayAction("zh-Hans").title).toBe("动作生命周期回放");
    expect(localizedReplayAction("zh-Hant").title).toBe("動作生命週期回放");
  });
});
