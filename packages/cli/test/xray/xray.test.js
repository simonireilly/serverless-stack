const {
  wrapWithLocalXray,
  xrayFlushSegments,
} = require("../../scripts/util/xray");
const { XRayClient, PutTraceSegmentsCommand } = require("@aws-sdk/client-xray");

const mockRunner = jest.fn();

jest.mock("@aws-sdk/client-xray");

describe("wrapWithLocalXRay and flush", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    delete process.env._X_AMZN_TRACE_ID;
  });

  it("does not use xray when process.env._X_AMZN_TRACE_ID is not present", async () => {
    await wrapWithLocalXray("./src/handlerName", mockRunner);

    await xrayFlushSegments();

    expect(mockRunner).toHaveBeenCalled();
    expect(XRayClient).not.toHaveBeenCalled();
  });

  it("sets the root segment to the current process.env._X_AMZN_TRACE_ID", async () => {
    process.env._X_AMZN_TRACE_ID =
      "Root=1-5759e988-bd862e3fe1be46a994272793;Parent=53995c3f42cd8ad8;Sampled=1";
    await wrapWithLocalXray("./src/handlerName", mockRunner);

    await xrayFlushSegments();

    expect(mockRunner).toHaveBeenCalled();
    expect(XRayClient).toHaveBeenCalled();
    expect(PutTraceSegmentsCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        TraceSegmentDocuments: expect.arrayContaining([
          expect.stringMatching(/53995c3f42cd8ad8/),
        ]),
      })
    );
  });

  it("does not forward segments when not sampled", async () => {
    process.env._X_AMZN_TRACE_ID =
      "Root=1-5759e988-bd862e3fe1be46a994272793;Parent=53995c3f42cd8ad8;";
    await wrapWithLocalXray("./src/handlerName", mockRunner);

    await xrayFlushSegments();

    expect(mockRunner).toHaveBeenCalled();
    expect(XRayClient).not.toHaveBeenCalled();
    expect(PutTraceSegmentsCommand).not.toHaveBeenCalled();
  });
});
